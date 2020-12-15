<template>
  <!-- component -->
  <section v-if="user" class="absolute top-0 w-full h-full">
    <div class="absolute top-0 w-full h-full bg-gray-900"></div>
    <div class="container h-full px-4 mx-auto">
      <div class="flex items-center content-center justify-center h-full">
        <div class="w-full px-4 pt-32 lg:w-4/12">
          <div
            class="relative flex flex-col w-full min-w-0 mb-6 break-words bg-gray-300 border-0 rounded-lg shadow-lg"
          >
            <div class="px-6 py-6 mb-0 rounded-t">
              <div class="mb-3 text-center">
                <h6 class="font-normal font-bold text-gray-600">Sign in</h6>
              </div>
              <hr class="mt-6 border-gray-400 border-b-1" />
            </div>
            <div class="flex-auto px-4 py-10 pt-0 lg:px-10">
              <form>
                <div class="relative w-full mb-3">
                  <label
                    class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                    for="grid-password"
                    >Phone No</label
                  >
                  <input
                    type="text"
                    class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white rounded shadow focus:outline-none focus:shadow-outline"
                    placeholder="Phone"
                    v-model="user.phone"
                  />
                </div>
                <div v-if="fromClose" class="relative w-full mb-3">
                  <label
                    class="block mb-2 text-xs font-bold text-gray-700 uppercase"
                    for="grid-password"
                    >Otp</label
                  >
                  <input
                    type="text"
                    class="w-full px-3 py-3 text-sm text-gray-700 placeholder-gray-400 bg-white rounded shadow focus:outline-none focus:shadow-outline"
                    placeholder="Otp"
                    v-model="user.otp"
                  />
                </div>
                <div class="mt-6 text-center">
                  <button
                    class="w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-gray-900 rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none"
                    type="button"
                    style="transition: all 0.15s ease 0s;"
                    @click="getOtp(user)"
                    v-on:click="closeAlert()"
                  >
                    Get OTP
                  </button>
                  <button
                    class="w-full px-6 py-3 mb-1 mr-1 text-sm font-bold text-white uppercase bg-gray-900 rounded shadow outline-none active:bg-gray-700 hover:shadow-lg focus:outline-none"
                    type="button"
                    style="transition: all 0.15s ease 0s;"
                    @click="verifyOtp(user)"
                    v-if="fromClose"
                  >
                    Submit OTP
                  </button>
                </div>
                <div>
                  <nuxt-link
                    to="register"
                    class="py-1 text-sm font-semibold text-gray-700"
                    >Don't have an account</nuxt-link
                  >
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="absolute bottom-0 w-full pb-6 bg-gray-900">
      <div class="container px-4 mx-auto">
        <hr class="mb-6 border-gray-700 border-b-1" />
        <div
          class="flex flex-wrap items-center justify-center md:justify-between"
        >
          <div class="w-full px-4 md:w-4/12">
            <div class="py-1 text-sm font-semibold text-white">
              Made with
              <a
                href="https://www.creative-tim.com/learning-lab/tailwind-starter-kit"
                class="py-1 text-sm font-semibold text-white hover:text-gray-400"
                target="_blank"
                >Tailwind Starter Kit
              </a>
            </div>
          </div>
          <div class="w-full px-4 md:w-8/12">
            <ul class="flex flex-wrap justify-center list-none md:justify-end">
              <li>
                <a
                  href="https://www.creative-tim.com"
                  class="block px-3 py-1 text-sm font-semibold text-white hover:text-gray-400"
                  target="_blank"
                  >Creative Tim</a
                >
              </li>
              <li>
                <a
                  href="https://www.creative-tim.com/presentation"
                  class="block px-3 py-1 text-sm font-semibold text-white hover:text-gray-400"
                  target="_blank"
                  >About Us</a
                >
              </li>
              <li>
                <a
                  href="https://creative-tim.com/blog"
                  class="block px-3 py-1 text-sm font-semibold text-white hover:text-gray-400"
                  target="_blank"
                  >Blog</a
                >
              </li>
              <li>
                <a
                  href="https://github.com/creativetimofficial/argon-design-system/blob/master/LICENSE.md"
                  class="block px-3 py-1 text-sm font-semibold text-white hover:text-gray-400"
                  target="_blank"
                  >MIT License</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </section>
</template>

<script>
import { get } from 'http'
import GET_OTP from '~/../gql/user/getOtp.gql'
import VERIFY_OTP from '~/../gql/user/verifyOtp.gql'

export default {
  data() {
    return {
      user: {},
      fromClose: false
    }
  },
  async created() {},
  methods: {
    async getOtp(userData) {
      try {
        await this.$apollo.mutate({
          mutation: GET_OTP,
          variables: userData
        })
      } catch (e) {
      } finally {
      }
    },
    async verifyOtp(userData) {
      try {
        await this.$apollo.mutate({
          mutation: VERIFY_OTP,
          variables: userData
        })
        this.$router.push('/welcome')
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
