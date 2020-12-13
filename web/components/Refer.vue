<template>
  <div>
    <div v-for="u in users" :key="u.id">
      <div class="flex items-center p-2 m-2">
        <img
          class="w-24 mr-8"
          src="https://i.pinimg.com/originals/e2/7c/87/e27c8735da98ec6ccdcf12e258b26475.png"
        />
        <div>
          <h3 class="text-2xl text-gray-900">{{ u.name }}</h3>
          <p class="text-lg text-gray-700">{{ u.phone }}</p>
          <p>{{ u.children }}</p>
          <p>{{ u.parent }}</p>
          <p>Referrel Code {{ u.referralCode }}</p>
          <p>{{ u.referedFrom }}</p>
          <p>{{ u.referedUsers }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import USERS from '~/../gql/user/users.gql'
import { EditIcon, TrashIcon, PlusCircleIcon } from 'vue-feather-icons'
export default {
  components: { EditIcon, TrashIcon, PlusCircleIcon },
  data() {
    return {
      users: null,
      user: null
    }
  },
  async created() {
    await this.getUsers()
  },
  methods: {
    async getUsers() {
      try {
        const result = await this.$apollo.query({
          query: USERS,
          fetchPolicy: 'no-cache'
        })
        console.log(result.data.users)
        this.users = result.data.users
      } catch (e) {
      } finally {
      }
    }
  }
}
</script>

<style></style>
