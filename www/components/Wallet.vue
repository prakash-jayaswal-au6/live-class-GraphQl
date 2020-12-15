<template>
  <div class="flex flex-col">
    <div class="flex items-center">
      <input
        type="text"
        v-model.number="amount"
        class="px-4 py-2 border border-red-200"
        placeholder="Amount"
      />
      <button @click="addMoney(amount)" class="material-button">
        Add Money
      </button>
    </div>
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
        <div
          class="overflow-hidden border-b border-gray-200 shadow sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Remark
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Transaction-id
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  direction
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Amount
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  TimeStamp
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
                >
                  Balance
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="t in transactions" :key="t.id">
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
                    class="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full"
                  >
                    {{ t.direction }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                  {{ t.amount }}
                </td>
                <td
                  class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"
                >
                  {{ t.createdAt }}
                </td>
                <td
                  class="px-6 py-4 text-sm font-medium text-right whitespace-nowrap"
                >
                  ₹ {{ t.balance }}
                </td>
              </tr>
            </tbody>
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
    const userId = '5fd8f269fba4e5244cb67cf9'
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
      const userId = '5fd8f269fba4e5244cb67cf9'
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
