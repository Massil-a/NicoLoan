<template>
  <div v-if="visible" :class="['notification', notificationClass]" @click="closeNotification">
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
  },
  data() {
    return {
      visible: true,
      notificationClass: this.color,
    };
  },
  mounted() {
    setTimeout(() => {
      this.closeNotification();
    }, 3000);
  },
  methods: {
    closeNotification() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  color: white;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.notification.success {
  background-color: green;
}

.notification.error {
  background-color: red;
}

.notification.info {
  background-color: blue;
}
</style>
