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
      <button class="create-button" @click="createRow">Créer un nouveau remboursement</button>
    </div>
  </div>
</template>

<script>
import { API_URL } from '@/config';
import VueCookies from 'vue-cookies';

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
    Closed: {
      type: Boolean,
      required: false,
    }
  },
  data() {
    return {
      columns: ['ClientTag', 'Nom du prêt', 'Date de paiement', 'Montant payé'],
      rows: [],
    };
  },
  methods: {
    async fetchRepaymentsByUser() {
      try {
        this.$store.dispatch('setLoading', true);

        const response = await fetch(`${API_URL}/repayments/myRepayments`, {
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
        this.rows = data.records.map(row => {
        if (this.Closed && row.loan.status === "Closed") {
          return {
            'ClientTag': row.client.clientTag,
            'Nom du prêt': row.loan.loanName,
            'Date de paiement': new Date(row.paymentDate).toLocaleDateString(),
            'Montant payé': `${row.amountPaid} €`,
          };
        } else {
          return null;
        }
      }).filter(row => row !== null);
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    async fetchRepaymentsByClientTag(ClientTag) {
      try {
        this.$store.dispatch('setLoading', true);

        const response = await fetch(`${API_URL}/repayments/getByClientTag/${ClientTag}`, {
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
        this.rows = data.record.map(row => ({
          'ClientTag': row.client.clientTag,
          'Nom du prêt': row.loanId,
          'Date de paiement': new Date(row.paymentDate).toLocaleDateString(),
          'Montant payé': `${row.amountPaid} €`,
        }));
      } catch (err) {
        this.$store.dispatch('setErrorMessage', err.message);
      } finally {
        this.$store.dispatch('setLoading', false);
      }
    },
    createRow() {
      this.$router.push('NewRepayment');
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
    Own(newOwn) {
      if (newOwn) {
        this.fetchRepaymentsByUser();
      }
    },
    ClientTag(newClientTag) {
      if (newClientTag) {
        this.fetchRepaymentsByClientTag(newClientTag);
      }
    },
  },
  created() {
    if (this.Own) {
      this.fetchRepaymentsByUser();
    } else if (this.ClientTag) {
      this.fetchRepaymentsByClientTag(this.ClientTag);
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