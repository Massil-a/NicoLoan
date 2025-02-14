<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" v-model="selectAll" :checked="isAllSelected" @change="toggleSelectAll"
                class="select-all-checkbox" />
            </th>
            <th v-for="(column, index) in columns" :key="index">
              {{ column }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="row.id">
            <td>
              <input type="checkbox" v-model="row.selected" @change="updateSelectAll" class="select-checkbox" />
            </td>
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              <div v-if="editingRowId !== row.id">{{ row[column] }}</div>

              <template v-if="editingRowId === row.id">
                <input v-if="column !== 'Statut'" v-model="editableRow[column]" :type="getInputType(column)"
                  :maxlength="getMaxLength(column)" :disabled="column === 'ClientTag'" class="editable-cell"
                  :placeholder="column === 'Date de création' ? 'yyyy-mm-dd' : ''" />
                <select v-if="column === 'Statut'" v-model="editableRow[column]" class="editable-cell"
                  :disabled="column === 'ClientTag'">
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PENDING">PENDING</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </template>
            </td>
            <td>
              <span v-if="editingRowId !== row.id" class="action-icon" @click="editRow(row)">
                <img src="@/assets/icons/edit.svg" alt="Modifier" />
              </span>
              <span v-else class="action-icon" @click="confirmModification(row.id)">
                <img src="@/assets/icons/confirm.svg" alt="Confirmer" />
              </span>
              <span v-if="editingRowId !== row.id" class="action-icon" @click="cloturerLigne(row.id)">
                <img src="@/assets/icons/cloturer.svg" alt="Clôturer" />
              </span>
              <span v-if="editingRowId !== row.id" class="action-icon" @click="deleteRow(row.id)">
                <img src="@/assets/icons/delete.svg" alt="Supprimer" />
              </span>
              <span v-if="editingRowId === row.id" class="action-icon" @click="cancelEdit">
                <img src="@/assets/icons/back.svg" alt="Annuler" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="button-left">
      <button class="create-button" @click="redirectNewLoan">Créer un nouveau prêt</button>
    </div>
    <div class="button-right">
      <button class="delete-selection-button" @click="deleteSelectedRows" :disabled="!anySelected">
        Supprimer sélection
      </button>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';

export default {
  props: {
    Own: Boolean,
    ClientTag: String,
    Status: Array
  },
  data() {
    return {
      columns: ['ClientTag', 'Opération', 'Montant dû', 'Montant total', 'Durée totale en mois', 'Date de création', 'Statut'],
      rows: [],
      selectAll: false,
      editingRowId: null,
      editableRow: {}
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
    async fetchRowsForOwn() {
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
          throw new Error(await response.text());
        }

        const data = await response.json();

        this.rows = data.record.filter(row => 
          !this.Status || this.Status.includes(row.status)
        ).map(row => ({
          'id': row.id,
          'ClientTag': row.client.clientTag,
          'Opération': row.loanName,
          'Montant dû': row.totalAmount - row.totalPaid,
          'Montant total': row.totalAmount,
          'Durée totale en mois': row.durationMonths,
          'Date de création': row.createdAt.split('T')[0],
          'Statut': row.status,
          'selected': false
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
          throw new Error(await response.text());
        }

        const data = await response.json();
        this.rows = data.record.filter(row => 
          !this.Status || this.Status.includes(row.status)
        ).map(row => ({
          'id': row.id,
          'ClientTag': row.client.clientTag,
          'Opération': row.loanName,
          'Montant dû': row.totalAmount - row.totalPaid,
          'Montant total': row.totalAmount,
          'Durée totale en mois': row.durationMonths,
          'Date de création': row.createdAt.split('T')[0],
          'Statut': row.status,
          'selected': false
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
    editRow(row) {
      this.editingRowId = row.id;
      this.editableRow = { ...row };
    },
    async confirmModification(id) {
      const index = this.rows.findIndex(row => row.id === id);
      if (index !== -1) {
        this.rows[index] = { ...this.editableRow };
      }

      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/loans/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
          body: JSON.stringify({
            loan : this.rows[index]
          })
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }

      this.editingRowId = null;
    },
    cancelEdit() {
      this.editingRowId = null;
    },
    async cloturerLigne(id) {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/loans/close`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
          body: JSON.stringify({ idLoan: id })
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        //const data = await response.json();
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    async deleteRow(idLoan) {
      try {
        this.$store.dispatch('setLoading', true);
        const response = await fetch(`${API_URL}/loans/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': VueCookies.get('nl_auth_token'),
          },
          body: JSON.stringify({ idLoan })
        });
        if (!response.ok) {
          throw new Error(await response.text());
        }
        this.rows = this.rows.filter(row => row.id !== idLoan);
        const data = await response.json();
        this.$store.dispatch('setErrorMessage', data.message)
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    deleteSelectedRows() { 
      const selectedIds = this.rows.filter(row => row.selected).map(row => row.id);
      selectedIds.forEach(id => this.deleteRow(id));
    },
    redirectNewLoan() {
      this.$router.replace('/NewLoan');
    },
    getInputType(column) {
      return column === 'Montant dû' || column === 'Durée totale en mois' ? 'number' : column === 'Date de création' ? 'date' : 'text';
    },
    getMaxLength(column) {
      return column === 'Opération' ? 300 : null;
    },
  },
  watch: {
    Own(newOwn) {
      if (newOwn) this.fetchRowsForOwn();
    },
    ClientTag(newClientTag) {
      if (newClientTag) this.fetchRowsByClientTag(newClientTag);
    },
  },
  created() {
    if (this.Own) this.fetchRowsForOwn();
    else if (this.ClientTag) this.fetchRowsByClientTag(this.ClientTag);
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
  height: 100%; /* Assure que la hauteur du conteneur prend toute la hauteur de son parent */
}

.table-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 70vh;
  width: 100%;
  margin-bottom: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 15px;
  border: 1px solid #ddd;
  text-align: left;
}

.data-table th {
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  position: sticky;
  top: 0;
  /* Correction du top pour que le header soit fixé */
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
}

.create-button,
.delete-selection-button {
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

.create-button:hover,
.delete-selection-button:hover {
  background-color: var(--primary-color-dark);
}

.delete-selection-button {
  background-color: red;
}

.delete-selection-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
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
