<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg" v-if="profile">
    <div class="px-4 py-5 sm:px-6">
      <h3 class="text-lg font-medium leading-6 text-gray-900">
        Applicant Information
      </h3>
      <p class="max-w-2xl mt-1 text-sm text-gray-500">
        Personal details and application.
      </p>
    </div>
    <div class="border-t border-gray-200">
      <dl>
        <div
          class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">
            Full name
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ profile.firstName + ' ' + profile.lastName }}
          </dd>
        </div>
        <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            Role
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ profile.role }}
          </dd>
        </div>
        <div
          class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">
            Contact No.
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ profile.phone }}
          </dd>
        </div>
        <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            Current Balance
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ profile.currentBalance }} ₹
          </dd>
        </div>
        <div
          class="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
        >
          <dt class="text-sm font-medium text-gray-500">
            Referral Code
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            {{ profile.referralCode }}
          </dd>
        </div>
        <div class="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-500">
            children
          </dt>
          <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
            <ul
              class="border border-gray-200 divide-y divide-gray-200 rounded-md"
            >
              <li
                class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
              >
                <div class="flex items-center flex-1 w-0">
                  <!-- Heroicon name: paper-clip -->
                  <span class="flex-1 w-0 ml-2 truncate"> Children 1 </span>
                </div>
              </li>
              <li
                class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
              >
                <div class="flex items-center flex-1 w-0">
                  <!-- Heroicon name: paper-clip -->
                  <span class="flex-1 w-0 ml-2 truncate"> Children 2 </span>
                </div>
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>

<script>
import MY_PROFILE from '~/../gql/user/user.gql'

export default {
  data() {
    return {
      profile: null
    }
  },
  async created() {
    const userId = '5fd8f269fba4e5244cb67cf9'
    await this.myProfile(userId)
  },
  methods: {
    async myProfile(id) {
      try {
        const profile = await this.$apollo.query({
          query: MY_PROFILE,
          variables: { id },
          fetchPolicy: 'no-cache'
        })
        console.log(profile.data.user)
        this.profile = profile.data.user
      } catch (e) {
      } finally {
      }
    }
  }
}
</script>

<style></style>
