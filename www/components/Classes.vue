<template>
  <div>
    <button
      type="button"
      class="fixed bottom-0 right-0 flex items-center justify-center w-12 h-12 p-4 mb-4 mr-4 text-white bg-green-600 border rounded-full shadow-lg hover:shadow-xl hover:bg-pink-500 focus:outline-none"
      @click="product = {}"
    >
      <PlusCircleIcon />
    </button>
    <div v-for="p in products" :key="p.id">
      <div
        class="max-w-md mx-auto overflow-hidden bg-white shadow-md rounded-xl md:max-w-2xl "
      >
        <div class="md:flex">
          <div class="md:flex-shrink-0">
            <img
              class="object-cover w-full h-48 md:w-48"
              src="https://ih1.redbubble.net/image.726903102.2890/pp,840x830-pad,1000x1000,f8f8f8.u1.jpg"
              alt="Man looking at item at a store"
            />
          </div>
          <div class="p-8">
            <div
              class="text-sm font-semibold tracking-wide uppercase text-sky-500"
            >
              {{ p.courseName }}
            </div>
            <a
              href="#"
              class="block mt-1 text-lg font-medium leading-tight text-black hover:underline"
            >
              ₹{{ p.pricePerHour }} /Hour
            </a>
            <p class="mt-2 text-gray-500">Available Seats {{ p.seats }}</p>
            <div class="flex items-center">
              <img
                class="w-10 h-10 mr-4 rounded-full"
                src="https://cdn1.truelancer.com/user-picture/1017877-5d83f3e4792bb.jpg"
                alt="Avatar of Jonathan Reinink"
              />
              <div class="text-sm">
                <p class="leading-none text-black">Posted-By</p>
                <p class="leading-none text-black">{{ p.postedBy }}</p>
              </div>
              <div class="mx-8">
                <button
                  class="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-green-500 rounded shadow ripple hover:shadow-lg hover:bg-green-600 focus:outline-none"
                  @click="bookProduct(p.id)"
                >
                  Book Class
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="product" class="p-8 mt-20 bg-yellow-200">
      <div>{{ product.id }}</div>
      <div>
        <label class="material-textbox-outlined">
          <input
            type="text"
            class="material-textbox-outlined"
            v-model="product.courseName"
          />
          <span>courseName</span>
        </label>
      </div>
      <div>
        <label class="material-textbox-outlined">
          <input
            type="text"
            class="material-textbox-outlined"
            v-model.number="product.pricePerHour"
          />
          <span>pricePerHour</span>
        </label>
      </div>
      <div>
        <label class="material-textbox-outlined">
          <input
            type="text"
            class="material-textbox-outlined"
            v-model="product.scheduleDateTime"
          />
          <span>scheduleDateTime</span>
        </label>
      </div>
      <div>
        <label class="material-textbox-outlined">
          <input
            type="text"
            class="material-textbox-outlined"
            v-model.number="product.seats"
          />
          <span>seats</span>
        </label>
      </div>
      <div>
        <label class="material-textbox-outlined">
          <input
            type="text"
            class="material-textbox-outlined"
            v-model="product.postedBy"
          />
          <span>postedBy</span>
        </label>
      </div>
      <div>
        <button class="material-button" @click="saveProduct(product)">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import PRODUCTS from '~/../gql/product/products.gql'
import PRODUCT from '~/../gql/product/product.gql'
import SAVE_PRODUCT from '~/../gql/product/saveProduct.gql'
import BOOK_PRODUCT from '~/../gql/user/bookProduct.gql'
import { EditIcon, TrashIcon, PlusCircleIcon } from 'vue-feather-icons'

export default {
  components: { EditIcon, TrashIcon, PlusCircleIcon },
  data() {
    return {
      products: null,
      product: null,
      amount: null
    }
  },
  async created() {
    await this.getProducts()
  },
  methods: {
    async getProduct(id) {
      try {
        this.product = (
          await this.$apollo.query({
            query: PRODUCT,
            variables: { id },
            fetchPolicy: 'no-cache'
          })
        ).data.product
      } catch (e) {
      } finally {
      }
    },
    async getProducts() {
      try {
        const result = await this.$apollo.query({
          query: PRODUCTS,
          fetchPolicy: 'no-cache'
        })
        console.log(result.data.products)
        this.products = result.data.products
      } catch (e) {
      } finally {
      }
    },
    async saveProduct(p) {
      if (!p.id) p.id = 'new'
      console.log('ccc', p)
      try {
        await this.$apollo.mutate({
          mutation: SAVE_PRODUCT,
          variables: p
        })
        await this.getProducts()
      } catch (e) {
      } finally {
      }
    },
    async bookProduct(pId) {
      const book = {}
      book.productId = pId
      book.userId = '5fd8f269fba4e5244cb67cf9'
      console.log(book)
      try {
        await this.$apollo.mutate({
          mutation: BOOK_PRODUCT,
          variables: book
        })
        this.$toast.success('Class Booked').goAway(2000)
        await this.getProducts()
      } catch (e) {
        console.log('err', e.errors)
        this.$toast.error(e.toString()).goAway(2000)
      } finally {
      }
    }
  }
}
</script>

<style></style>
