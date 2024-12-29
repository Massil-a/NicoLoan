<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th v-for="(column, index) in columns" :key="index">
              {{ column }}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
            <td v-for="(column, colIndex) in columns" :key="colIndex">
              {{ row[column] }}
            </td>
            <td>
              <span class="action-icon" @click="duplicateRow(rowIndex)">
                <img src="@/assets/icons/duplicate.svg" alt="Dupliquer" />
              </span>
              <span class="action-icon" @click="editRow(rowIndex)">
                <img src="@/assets/icons/edit.svg" alt="Modifier" />
              </span>
              <span class="action-icon" @click="deleteRow(rowIndex)">
                <img src="@/assets/icons/delete.svg" alt="Supprimer" />
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="create-button-container">
      <button class="create-button" @click="createRow">Créer</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TableComponent',
  props: {
    UserId: {
      type: String,
      required: false,
    },
    ClientTag: {
      type: String,
      required: false,
    },
  },
  data() {
    return {
      columns: ['ClientTag', 'Opération', 'Montant dûe', 'Durée totale en mois', 'Date de création', 'Statut'],
      rows: [],
    };
  },
  methods: {
    fetchRowsByUserId(UserId) {
      // Implémentez ici la logique pour récupérer les données par UserId
      // Par exemple, une requête API pour récupérer les données
      this.rows = [
        // Exemple de données récupérées
        { ClientTag: 'User1', Opération: 'Opération1', 'Montant dûe': '1000 €', 'Durée totale en mois': 12, 'Date de création': '2022-01-01', Statut: 'En cours' },
        // Ajoutez d'autres lignes si nécessaire
      ];
    },
    fetchRowsByClientTag(ClientTag) {
      // Implémentez ici la logique pour récupérer les données par ClientTag
      // Par exemple, une requête API pour récupérer les données
      this.rows = [
        // Exemple de données récupérées
        { ClientTag: 'Client1', Opération: 'Opération1', 'Montant dûe': '2000 €', 'Durée totale en mois': 24, 'Date de création': '2022-01-01', Statut: 'Terminé' },
        // Ajoutez d'autres lignes si nécessaire
      ];
    },
    createRow() {
      const newRow = this.columns.reduce((acc, column) => {
        acc[column] = '';
        return acc;
      }, {});
      this.rows.push(newRow);
    },
    duplicateRow(index) {
      const duplicatedRow = { ...this.rows[index] };
      this.rows.splice(index + 1, 0, duplicatedRow);
    },
    editRow(index) {
      console.log('Edit row at index', index);
    },
    deleteRow(index) {
      this.rows.splice(index, 1);
    },
  },
  watch: {
    UserId(newUserId) {
      if (newUserId) {
        this.fetchRowsByUserId(newUserId);
      }
    },
    ClientTag(newClientTag) {
      if (newClientTag) {
        this.fetchRowsByClientTag(newClientTag);
      }
    },
  },
  created() {
    if (this.UserId) {
      this.fetchRowsByUserId(this.UserId);
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
  top: -2%;
  z-index: 1;
}

.data-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.data-table tr:hover {
  background-color: #f1f1f1;
}

.create-button-container {
  margin-top: 20px;
  align-self: flex-start;
}

.create-button {
  background-color: var(--primary-color);
  color: var(--whiteDarkable);
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.create-button:hover {
  background-color: var(--primary-color-dark);
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
</style>
