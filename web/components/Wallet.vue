<template>
  <div class="flex flex-col">
    <input
      type="text"
      v-model.number="amount"
      class="border border-red-200 px-4 py-2"
      placeholder="Amount"
    />
    <button @click="addMoney(amount)">Add</button>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Remark
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Transaction-id
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  direction
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Role
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Edit</span>
                </th>
              </tr>
            </thead>

            <div v-for="t in transactions" :key="t.id">
              <tbody class="bg-white divide-y divide-gray-200">
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ t.remark }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ t.id }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                    >
                      {{ t.direction }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ t.amount }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    ₹ {{ t.balance }}
                  </td>
                </tr>
                <!-- More rows... -->
              </tbody>
            </div>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MY_TRANSACTIONS from '~/../gql/wallet/userTransaction.gql'
import ADD_MONEY from '~/../gql/wallet/addMoney.gql'
export default {
  data() {
    return {
      transactions: null,
      amount: null
    }
  },
  async created() {
    const userId = '5fd3248f01f1550a88df1391'
    await this.myTransactions(userId)
  },
  methods: {
    async myTransactions(userId) {
      try {
        const transactions = await this.$apollo.query({
          query: MY_TRANSACTIONS,
          variables: { userId },
          fetchPolicy: 'no-cache'
        })

        // console.log(transactions.data.userTransaction)
        this.transactions = transactions.data.userTransaction
      } catch (e) {
      } finally {
      }
    },
    async addMoney(amount) {
      const userId = '5fd3248f01f1550a88df1391'
      // console.log(amount)
      try {
        const data = (
          await this.$apollo.mutate({
            mutation: ADD_MONEY,
            variables: { userId, amount },
            fetchPolicy: 'no-cache'
          })
        ).data.addMoney
        // console.log('xxxxx', data)
        await this.myTransactions(userId)
      } catch (e) {
        console.log('eeee', e)
      } finally {
      }
    }
  }
}
</script>

<style></style>
