<template>
  <!-- component -->
  <div>
    <h1
      class="w-full my-3 text-3xl font-normal leading-loose text-center text-grey-darkest"
    >
      Parent Control
    </h1>
    <table class="min-w-full table-auto">
      <thead class="justify-between">
        <tr class="bg-gray-800">
          <th class="px-16 py-2">
            <span class="text-gray-300"></span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Name</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Link</span>
          </th>
          <th class="px-16 py-2">
            <span class="text-gray-300">Product Id</span>
          </th>

          <th class="px-16 py-2">
            <span class="text-gray-300">Phone</span>
          </th>

          <th class="px-16 py-2">
            <span class="text-gray-300">Balance</span>
          </th>
        </tr>
      </thead>
      <tbody class="bg-gray-200" v-for="c in childs" :key="c.id">
        <tr class="bg-white border-4 border-gray-200">
          <td class="flex flex-row items-center px-16 py-2">
            <img
              class="object-cover w-8 h-8 rounded-full "
              src="https://png.pngtree.com/png-vector/20191009/ourmid/pngtree-user-icon-png-image_1796659.jpg"
              alt=""
            />
          </td>
          <td>
            <span class="ml-2 font-semibold text-center">{{
              c.firstName + ' ' + c.lastName
            }}</span>
          </td>
          <td class="px-16 py-2">
            <button
              class="px-4 py-2 text-white bg-indigo-500 border rounded-md hover:bg-white hover:border-indigo-500 hover:text-black "
            >
              Go to Profile
            </button>
          </td>
          <td class="px-16 py-2">
            <span>{{ c.products }}</span>
          </td>
          <td class="px-16 py-2">
            <span>{{ c.phone }}</span>
          </td>

          <td class="px-16 py-2">
            <span>₹ {{ c.currentBalance }}</span>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="user">
      <form class="flex m-10">
        <input
          class="p-4 mr-0 text-gray-800 bg-white border-t border-b border-l border-gray-200 rounded-l-lg"
          placeholder="Enter phone no of child"
          v-model="user.phone"
        />
        <input
          class="p-4 mr-0 text-gray-800 bg-white border-t border-b border-l border-gray-200 rounded-l-lg"
          placeholder="Enter OTP"
          v-model="user.otp"
          v-if="fromClose"
        />
        <button
          class="p-4 px-8 font-bold text-gray-800 uppercase bg-yellow-400 border-t border-b border-r border-yellow-500 rounded-r-lg"
          type="submit"
          @click.prevent="requestToChild(user)"
          v-on:click="closeAlert()"
        >
          Request to a child
        </button>
        <button
          class="p-4 px-8 font-bold text-gray-800 uppercase bg-blue-400 border-t border-b border-r border-yellow-500 rounded-r-lg"
          type="submit"
          @click.prevent="addChildToParent(user)"
          v-if="fromClose"
        >
          Submit Otp
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import GET_CHILDS from '~/../gql/parentConnect/getChildOfParent.gql'
import REQUEST_TO_CHILD from '~/../gql/parentConnect/requestToChild.gql'
import ADD_CHILD_TO_PARENT from '~/../gql/parentConnect/addChildToParent.gql'
import ME from '~/../gql/user/me.gql'

export default {
  data() {
    return {
      me: null,
      child: null,
      childs: null,
      user: {},
      fromClose: false
    }
  },
  async created() {
    this.getMe()
  },
  methods: {
    async getMe() {
      try {
        this.me = (
          await this.$apollo.query({
            query: ME,
            fetchPolicy: 'no-cache'
          })
        ).data.me
        await this.getChilds(this.me.id)
      } catch (e) {
      } finally {
      }
    },
    async getChilds(parentId) {
      try {
        const result = await this.$apollo.query({
          query: GET_CHILDS,
          variables: { parentId },
          fetchPolicy: 'no-cache'
        })
        // console.log(result.data.getChildOfParent)
        this.childs = result.data.getChildOfParent
      } catch (e) {
      } finally {
      }
    },
    async requestToChild(userData) {
      userData.parentId = this.me.id
      // console.log(userData)
      try {
        await this.$apollo.mutate({
          mutation: REQUEST_TO_CHILD,
          variables: userData
        })
        this.$toast.success('Otp sent to the child').goAway(2000)
      } catch (e) {
        this.$toast.error(e.toString()).goAway(2000)
      } finally {
      }
    },
    async addChildToParent(userData) {
      userData.parentId = this.me.id
      console.log(userData)
      try {
        await this.$apollo.mutate({
          mutation: ADD_CHILD_TO_PARENT,
          variables: userData
        })
        this.$toast.success('SuccesFully Added child').goAway(2000)
        await this.getChilds(userData.parentId)
      } catch (e) {
        this.$toast.error(e.toString()).goAway(2000)
      } finally {
      }
    },
    closeAlert: function() {
      this.fromClose = true
    }
  }
}
</script>

<style></style>
