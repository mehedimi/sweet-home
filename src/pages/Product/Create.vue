<script setup>
import Api from "@/composable/useApi";
import { inject, reactive, ref } from "vue";
import { StreamBarcodeReader } from "vue-barcode-reader";

const MODE = {
  STOCK: 0,
  PRODUCT: 1,
  SEARCH: 2,
};

const mode = ref(MODE.SEARCH);

const products = inject("products");
const stockItems = inject("stockItems");
const expandIndex = inject("expandIndex");

const product = reactive({
  postId: 0,
  barcode: "",
  name: "",
  mfd: "",
  exp: "",
  quantity: 1,
  exists: false,
});

function reset() {
  product.name = "";
  product.mfd = "";
  product.exp = "";
  product.quantity = 1;
  product.exists = false;
  product.postId = 0;
  product.barcode = "";

  mode.value = MODE.SEARCH;
}

function decode(barcode) {
  product.barcode = barcode;
  handle()
}

function handle() {
  switch (mode.value) {
    case MODE.STOCK:
      addStock();
      break;
    case MODE.PRODUCT:
      create();
      break;
    case MODE.SEARCH:
      search();
      break;
  }
}

function create() {
  const { name, barcode } = product;
  Api.post("/products", {
    name,
    barcode,
  }).then(({ data }) => {
    products.value.push(data.data);
    mode.value = MODE.STOCK;
  });
}

function search() {
  const { barcode } = product;
  Api.get(`/products/${barcode}`)
    .then(({ data }) => {
      product.exists = true;
      product.name = data.data.post_title;
      product.postId = data.data.ID;
      mode.value = MODE.STOCK;
    })
    .catch(() => {
      product.exists = false;
      mode.value = MODE.PRODUCT;
    });
}

function addStock() {
  Api.post(`/products/${product.postId}/stocks`, {
    quantity: product.quantity,
    mfd: product.mfd,
    exp: product.exp,
  }).then(({ data }) => {
    if (
      expandIndex.value &&
      products.value[expandIndex.value].ID === product.postId
    ) {
      stockItems.value.push(data.data);
    }
    reset();
  });
}
</script>

<template>
  <StreamBarcodeReader
    v-if="mode === MODE.SEARCH"
    class="[&>div>video]:mx-auto"
    @decode="decode"
  />
  <form @submit.prevent="handle">
    <div class="my-3">
      <label for="barcode" class="text-gray-500">Barcode</label>
      <input
        type="text"
        required
        v-model="product.barcode"
        id="barcode"
        class="rounded border border-gray-300 w-full"
      />
    </div>
    <div class="my-3" v-if="mode === MODE.PRODUCT">
      <label for="name" class="text-gray-500">Name</label>
      <input
        type="text"
        required
        id="name"
        v-model="product.name"
        class="rounded border border-gray-300 w-full"
      />
    </div>
    <template v-if="mode === MODE.STOCK">
      <div class="my-3">
        <label for="mfd" class="text-gray-500">Manufacture Date</label>
        <input
          type="date"
          required
          v-model="product.mfd"
          id="mfd"
          class="rounded border border-gray-300 w-full"
        />
      </div>
      <div class="my-3">
        <label for="exp" class="text-gray-500">Expire Date</label>
        <input
          type="date"
          required
          v-model="product.exp"
          id="exp"
          class="rounded border border-gray-300 w-full"
        />
      </div>
      <div class="my-3">
        <label for="quantity" class="text-gray-500">Quantity</label>
        <input
          type="number"
          required
          v-model="product.quantity"
          id="quantity"
          class="rounded border border-gray-300 w-full"
        />
      </div>
    </template>
    <div class="text-right">
      <button
        class="inline-block px-4 py-2 text-white rounded bg-indigo-500 mr-4"
      >
        <template v-if="mode === MODE.SEARCH"> Search </template>
        <template v-else-if="mode === MODE.PRODUCT"> Create </template>
        <template v-else-if="mode === MODE.STOCK"> Add </template>
      </button>
      <router-link
        class="inline-block px-4 py-2 text-white rounded bg-red-500"
        :to="{ name: 'product.index' }"
      >
        Cancel
      </router-link>
      <button
        @click="reset"
        type="button"
        class="inline-block px-4 py-2 text-white rounded bg-gray-500 ml-4"
      >
        Reset
      </button>
    </div>
  </form>
</template>
