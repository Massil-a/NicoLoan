<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input 
                type="checkbox" 
                v-model="selectAll" 
                :checked="isAllSelected" 
                @change="toggleSelectAll"
                class="select-all-checkbox"
              />
            </th>
            <th v-for="(column, index) in columns" :key="index">
              {{ column }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td>
              <input 
                type="checkbox" 
                v-model="row.selected" 
                @change="updateSelectAll" 
                class="select-checkbox"
              />
            </td>
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              <div v-if="editingRowIndex !== rowIndex">{{ row[column] }}</div>

              <template v-if="editingRowIndex === rowIndex">
                <input 
                  v-if="column !== 'Statut'" 
                  v-model="row[column]" 
                  :type="getInputType(column)" 
                  :maxlength="getMaxLength(column)"
                  :disabled="column === 'ClientTag'" 
                  class="editable-cell"
                  :placeholder="column === 'Date de création' ? 'yyyy-mm-dd' : ''"
                />
                <select 
                  v-if="column === 'Statut'" 
                  v-model="row[column]" 
                  class="editable-cell" 
                  :disabled="column === 'ClientTag'"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </template>
            </td>
            <td>
              <span v-if="editingRowIndex !== rowIndex" class="action-icon" @click="editRow(rowIndex)">
                <img src="@/assets/icons/edit.svg" alt="Modifier" />
              </span>
              <span v-else class="action-icon" @click="confirmModification(rowIndex)">
                <img src="@/assets/icons/confirm.svg" alt="Confirmer" />
              </span>
              <!-- Masquer le bouton de suppression en mode édition -->
              <span v-if="editingRowIndex !== rowIndex" class="action-icon" @click="deleteRow(rowIndex)">
                <img src="@/assets/icons/delete.svg" alt="Supprimer" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="button-container">
        <div class="button-left">
          <button class="create-button" @click="createRow">Créer un nouveau prêt</button>
        </div>
        <div class="button-right">
          <button 
            class="delete-selection-button" 
            @click="deleteSelectedRows" 
            :disabled="!anySelected" 
          >
            Supprimer sélection
          </button>
        </div>
      </div>
  </div>
</template>

<script>
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies'

export default {
  props: {
    Own: {
      type: Boolean,
      required: false,
    },
    ClientTag: {
      type: String,
      required: false,
    },
    Status : {
      type: String,
      required: false,
    }
  },
  data() {
    return {
      columns: ['ClientTag', 'Opération', 'Montant dû', 'Durée totale en mois', 'Date de création', 'Statut'],
      rows: [],
      selectAll: false,
      editingRowIndex: null,
    };
  },
  computed: {
    isAllSelected() {
      return this.rows.length && this.rows.every(row => row.selected);
    },
    anySelected() {
      return this.rows.some(row => row.selected);
    }
  },
  methods: {
    async fetchRowsForOwn(UserId) {
      try {
        this.$store.dispatch('setLoading', true);

        const response = await fetch(`${API_URL}/loans/getByUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.rows = data.record.map((row) => ({
          'ClientTag': row.client.clientTag,
          'Opération': row.loanName,
          'Montant dû': `${row.totalAmount} €`,
          'Durée totale en mois': row.durationMonths,
          'Date de création': new Date(row.createdAt).toLocaleDateString(),
          'Statut': row.status,
          'selected': false,
        }));
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    async fetchRowsByClientTag(ClientTag) {
      try {
        this.$store.dispatch('setLoading', true);

        const response = await fetch(`${API_URL}/loans/getByClientTag/${ClientTag}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
        });

        if (!response.ok) {
          const e = await response.json();
          throw new Error(`${e.message} (${e.errorCode})`);
        }

        const data = await response.json();
        this.rows = data.record.filter(row => {
          if (this.Status !== null && row.status === this.Status) {
            return true;
          } else if (this.Status === null) {
            return true;
          }
          return false;
        }).map((row) => ({
          'ClientTag': row.client.clientTag,
          'Opération': row.loanName,
          'Montant dû': `${row.totalAmount} €`,
          'Durée totale en mois': row.durationMonths,
          'Date de création': new Date(row.createdAt).toLocaleDateString(),
          'Statut': row.status,
          'selected': false,
        }));
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    toggleSelectAll() {
      this.rows.forEach(row => row.selected = this.selectAll);
    },
    updateSelectAll() {
      this.selectAll = this.isAllSelected;
    },
    editRow(index) {
      this.editingRowIndex = index;
    },
    confirmModification(index) {
      this.editingRowIndex = null;
      // Logique de confirmation si nécessaire
    },
    deleteRow(index) {
      this.rows.splice(index, 1);
    },
    deleteSelectedRows() {
      const selectedIds = this.rows.filter(row => row.selected).map(row => row.id);
      // Appeler l'API de suppression ici
      this.rows = this.rows.filter(row => !row.selected);
    },
    createRow() {
      this.$router.push('NewLoan');
    },
    getInputType(column) {
      if (column === 'Montant dû') {
        return 'number';
      } else if (column === 'Durée totale en mois') {
        return 'number';
      } else if (column === 'Date de création') {
        return 'date';
      } else {
        return 'text';
      }
    },
    getMaxLength(column) {
      if (column === 'Opération') {
        return 300;
      }
      return null;
    },
  },
  watch: {
    Own(newOwn) {
      if (newOwn) {
        this.fetchRowsForOwn(newOwn);
      }
    },
    ClientTag(newClientTag) {
      if (newClientTag) {
        this.fetchRowsByClientTag(newClientTag);
      }
    },
  },
  created() {
    if (this.Own) {
      this.fetchRowsForOwn(this.Own);
    } else if (this.ClientTag) {
      this.fetchRowsByClientTag(this.ClientTag);
    }
  },
};
</script>

<style scoped>
.table-container {
  margin: 20px;
  padding: 20px;
  background-color: var(--whiteDarkable);
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: 100%;
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 70vh;
  width: 100%;
  margin-bottom: 20px; /* Ajouté pour un espacement sous le tableau */
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.data-table th {
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  position: sticky;
  top: 0; /* Correction du top pour que le header soit fixé */
  z-index: 1;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

.button-container {
  display: flex;
  justify-content: space-between;
  gap: 30px;
  margin-top: 20px;
}

.create-button, .delete-selection-button {
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.create-button:hover, .delete-selection-button:hover {
  background-color: var(--primary-color-dark);
}

.delete-selection-button {
  background-color: red;
}

.delete-selection-button:disabled {
  background-color: #ccc;
}

.action-icon {
  cursor: pointer;
  margin: 0 5px;
}

.action-icon img {
  width: 20px;
  height: 20px;
  transition: 0.3s;
}

.action-icon img:hover {
  opacity: 0.7;
}

.select-all-checkbox {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.select-checkbox {
  cursor: pointer;
  width: 20px;
  height: 20px;
}

.editable-cell {
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.editable-cell:disabled {
  background-color: #f1f1f1;
}
</style>
