<template>
  <a class="client-card" @click="handleClick(page)">
    <h3>{{ number }}</h3>
    <h4>{{ title }}</h4>
    <p>{{ description }}</p>
    <span class="link-text">
      {{ link }}
      <svg width="25" height="16" viewBox="0 0 25 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.863 0.929L24.227 7.293c.39.391.39.924 0 1.315L17.863 15.071c-.39.391-.924.391-1.315 0-.391-.391-.391-.924 0-1.315L21.106 9H0.48V7h21.106L16.448 2.343c-.391-.391-.391-.924 0-1.315.391-.391.924-.391 1.315 0z" fill="var(--primary-color-dark)"/>
      </svg>
    </span>
  </a>
</template>

<script>
export default {
  name: 'ClientCard',
  props: {
    number: {
      type: String,
      required: true,
      validator(value) {
        return value.length <= 9; // 9 char max
      }
    },
    title: {
      type: String,
      required: true,
      validator(value) {
        return value.length <= 20; // 20 char max
      }
    },
    description: {
      type: String,
      required: true
    },
    page: {
      type: String,
      required: false
    }
  },
  methods: {
    handleClick(page) {
      // Fonction à remplir plus tard
      console.log('Page:', page);
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.client-card {
  display: flex;
  flex-direction: column;
  max-width: 20.75em;
  min-height: 20.75em;
  overflow: hidden;
  border-radius: .5em;
  text-decoration: none;
  background: var(--whiteDarkable);
  margin: 1em;
  padding: 2.75em 2.5em;
  box-shadow: var(--box-shadow);
  transition: transform .45s ease, background .45s ease;
}

.client-card h3 {
  color: var(--blackText);
  font-size: 3.5em;
  font-weight: 600;
  line-height: 1;
  padding-bottom: .5em;
  margin: 0 0 0.142857143em;
  border-bottom: 2px solid var(--primary-color-dark);
  transition: color .45s ease, border .45s ease;
}

.client-card h4 {
  color: #627084;
  text-transform: uppercase;
  font-size: 1.125em;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0.1em;
  margin: 0 0 1.777777778em;
  transition: color .45s ease;
}

.client-card p {
  opacity: 0;
  color: #FFFFFF;
  font-weight: 600;
  line-height: 1.8;
  margin: 0 0 1.25em;
  transform: translateY(-1em);
  transition: opacity .45s ease, transform .5s ease;
}

.client-card .link-text {
  display: block;
  color: var(--primary-color-dark);
  font-size: 1.125em;
  font-weight: 600;
  line-height: 1.2;
  margin: auto 0 0;
  transition: color .45s ease;
}

.client-card .link-text svg {
  margin-left: .5em;
  transition: transform .6s ease;
}

.client-card .link-text svg path {
  transition: fill .45s ease;
}

.client-card:hover {
  background: var(--primary-color-dark);
  transform: scale(1.02);
}

.client-card:hover h3 {
  color: #FFFFFF;
  border-bottom-color: var(--primary-color);
}

.client-card:hover h4 {
  color: #FFFFFF;
}

.client-card:hover p {
  opacity: 1;
  transform: none;
}

.client-card:hover .link-text {
  color: #FFFFFF;
}

.client-card:hover .link-text svg {
  animation: point 1.25s infinite alternate;
}

.client-card:hover .link-text svg path {
  fill: #FFFFFF;
}

@keyframes point {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(.125em);
  }
}
</style>
