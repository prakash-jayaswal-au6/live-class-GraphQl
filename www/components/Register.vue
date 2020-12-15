<template>
  <div v-if="user" class="font-sans antialiased bg-gray-900 ">
    <div class="w-full bg-grey-lightest" style="padding-top: 4rem;">
      <div class="container py-8 mx-auto">
        <div class="w-5/6 mx-auto bg-white rounded shadow lg:w-1/2">
          <div
            class="px-8 py-4 text-xl text-black border-b border-grey-lighter"
          >
            Register for a free account
          </div>
          <form @submit.prevent="registerUser(user)" class="px-8 py-4">
            <div class="flex mb-4">
              <div class="w-1/2 mr-1">
                <label
                  class="block mb-2 text-sm font-bold text-grey-darker"
                  for="first_name"
                  >First Name</label
                >
                <input
                  class="w-full px-3 py-2 border rounded appearance-none text-grey-darker"
                  id="first_name"
                  type="text"
                  v-model="user.firstName"
                  placeholder="Your first name"
                />
              </div>
              <div class="w-1/2 ml-1">
                <label
                  class="block mb-2 text-sm font-bold text-grey-darker"
                  for="last_name"
                  >Last Name</label
                >
                <input
                  class="w-full px-3 py-2 border rounded appearance-none text-grey-darker"
                  id="last_name"
                  type="text"
                  v-model="user.lastName"
                  placeholder="Your last name"
                />
              </div>
            </div>
            <div class="mb-4">
              <label
                class="block mb-2 text-sm font-bold text-grey-darker"
                for="email"
                >Email Address</label
              >
              <input
                class="w-full px-3 py-2 border rounded appearance-none text-grey-darker"
                id="email"
                type="email"
                v-model="user.email"
                placeholder="Your email address"
              />
            </div>
            <div class="mb-4">
              <label
                class="block mb-2 text-sm font-bold text-grey-darker"
                for="password"
                >Phone</label
              >
              <input
                class="w-full px-3 py-2 border rounded appearance-none text-grey-darker"
                type="text"
                v-model="user.phone"
                placeholder="Your phone number"
              />
            </div>
            <div class="mb-4">
              <label
                class="block mb-2 text-sm font-bold text-grey-darker"
                for="password"
                >Referral Code</label
              >
              <input
                class="w-full px-3 py-2 border rounded appearance-none text-grey-darker"
                type="text"
                v-model="user.referralCode"
                placeholder="referrel code"
              />
            </div>
            <div class="mt-4">
              <span class="text-gray-700">Account Type</span>
              <div class="mt-2">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    class="form-radio"
                    name="accountType"
                    value="parent"
                    v-model="user.role"
                  />
                  <span class="ml-2">Parent</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    class="form-radio"
                    name="accountType"
                    value="teacher"
                    v-model="user.role"
                  />
                  <span class="ml-2">Teacher</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    class="form-radio"
                    name="accountType"
                    value="author"
                    v-model="user.role"
                  />
                  <span class="ml-2">Author</span>
                </label>
                <label class="inline-flex items-center ml-6">
                  <input
                    type="radio"
                    class="form-radio"
                    name="accountType"
                    value="user"
                    v-model="user.role"
                  />
                  <span class="ml-2">Student</span>
                </label>
              </div>
            </div>
            <div class="flex items-center justify-between mt-8">
              <button
                class="px-4 py-2 font-bold text-white uppercase bg-gray-900 rounded-full bg-blue hover:bg-blue-dark"
                type="submit"
              >
                Sign Up
              </button>
            </div>
            <p class="my-4 text-center">
              <nuxt-link
                to="login"
                class="py-1 text-sm font-semibold text-white-700"
                >Already have an account</nuxt-link
              >
            </p>
          </form>
        </div>
      </div>
    </div>
    <!-- Footer -->
    <footer class="w-full py-8 bg-grey-lighter">
      <div class="container px-8 mx-auto text-center">
        <p class="mb-2 text-sm text-grey-dark">
          This is a product of <span class="font-bold">Your Company</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import REGISTER_USER from '~/../gql/user/register.gql'

export default {
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        referralCode: '',
        role: ''
      }
    }
  },
  async created() {},
  methods: {
    async registerUser(userData) {
      try {
        await this.$apollo.mutate({
          mutation: REGISTER_USER,
          variables: userData
        })
        this.$toast.success('Success').goAway(2000)
        this.$router.push('/welcome')
      } catch (e) {
        console.log('err', e.errors)
        this.$toast.error(e.toString()).goAway(2000)
      } finally {
      }
    },

    closeAlert: function() {
      this.alertOpen = false
    }
  }
}
</script>

<style></style>
