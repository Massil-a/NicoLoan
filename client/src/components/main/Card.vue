<template>
    <div class="card" @click="redirect">
        <img :src="imageUrl" alt="icon" class="card-icon" />
        <h2>{{ title }}</h2>
        <p>{{ subtitle }}</p>
    </div>
</template>

<script>
const icons = import.meta.glob('@/assets/icons/*.svg', { eager: true });

export default {
    props: {
        iconPath: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        redirectPath: {
            type: String,
            required: false
        }
    },
    data() {
        return {
            imageUrl: icons[`/src/assets/icons/${this.iconPath}`]?.default || ''
        }
    },
    methods: {
        redirect() {
            alert(document.getElementsByClassName("card-icon")[0].src + ' alors que image url : ' + this.imageUrl)
            if (this.redirectPath) {
                //   this.$router.push(this.redirectPath);
            }
        }
    }
};
</script>

<style scoped>
.card {
    background-color: var(--whiteDarkable);
    box-shadow: var(--box-shadow);
    color: var(--blackText);
    padding: 20px;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.3s, box-shadow 0.3s;
    width: 300px;
    text-align: center;
}

.card:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 2px 4px rgba(0, 0, 0, 0.15);
}

.card h2 {
    margin: 0;
    color: var(--primary-color);
}

.card p {
    margin: 10px 0 0 0;
    color: var(--blackText);
    opacity: 0.7;
    font-size: 0.9em;
}

.card-icon {
    width: 40px;
    height: 40px;
    margin-bottom: 10px;
}
</style>