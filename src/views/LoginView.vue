<template>
  <div class="login-page">
    <div class="login-card">
      <div class="logo">
        <img src="../assets/icons/BigGreenB.png" alt="logo" />
      </div>

      <h1 class="title">Best Schedule</h1>

      <div class="field">
        <label>   имя/email:</label>
        <div class="input">
          <img src="../assets/icons/human.svg" alt="" />
          <input
            type="text"
            placeholder="ваше имя/email"
            v-model="email"
          />
        </div>
      </div>

      <div class="field">
        <label>   учебное заведение:</label>
        <div class="input">
          <img src="../assets/icons/hat.svg" alt="" />
          <input type="text" placeholder="ваше учебное заведение" />
        </div>
      </div>

      <div class="field">
        <label>   пароль:</label>
        <div class="input">
          <img src="../assets/icons/lock.svg" alt="" />
          <input
            type="password"
            placeholder="ваш пароль"
            v-model="password"
          />
        </div>
      </div>

      <p v-if="error" style="color: red; margin-top: 10px;">
        {{ error }}
      </p>
      <button class="login-btn" @click="login" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'ВОЙТИ' }}
      </button>
    </div>

    <div class="footer">too “community corporation”</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { graphqlRequest } from '../api'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const login = async () => {
  error.value = ''
  loading.value = true

  try {
    const data = await graphqlRequest(`
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user {
            id
            name
            role
          }
        }
      }
    `, {
      email: email.value,
      password: password.value
    })

    localStorage.setItem('token', data.login.token)

    router.push('/schedule') // измени если маршрут другой
  } catch (e) {
    error.value = e.message || 'Ошибка соединения с сервером'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  width: 100vw;

  background: url('../assets/images/loginbackground.png') center / cover no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  font-family: Arial, Helvetica, sans-serif;
}

/* ---------- Card ---------- */
.login-card {
  width: 300px;
  max-width: 90vw;

  background: #E6EBF1;
  border-radius: 32px;
  padding: 40px 38px 44px;

  text-align: center;
}

/* ---------- Logo ---------- */
.logo {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: #E6EBF1;

  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;

  box-shadow:
    4px 4px 4px rgba(0, 0, 0, 0.25),
    -4px -4px 4px rgba(255, 255, 255, 1);
}

.logo img {
  width: 58px;
  height: 58px;
}

/* ---------- Title ---------- */
.title {
  margin: 10px 0 34px;
  font-size: 36px;
  font-weight: 400;
  color: #1e8f84;
}

/* ---------- Fields ---------- */
.field {
  text-align: left;
  margin-bottom: 16px;
}

.field label {
  display: block;
  font-size: 15px;
  color: #6b7b7b;
  margin-bottom: 6px;
}

/* ---------- Input ---------- */
.input {
  display: flex;
  align-items: center;
  gap: 10px;

  background: #E6EBF1;
  border-radius: 14px;
  padding: 12px 14px;

  box-shadow:
    inset 4px 4px 4px rgba(0, 0, 0, 0.25),
    inset -4px -4px 4px rgba(255, 255, 255, 1);

  transition: box-shadow 0.25s ease;
}

.input img {
  width: 18px;
  height: 18px;
  opacity: 0.7;
}

.input input {
  border: none;
  outline: none;
  background: transparent;

  font-size: 15px;
  color: #2b3a3a;
  width: 100%;
}

.input input::placeholder {
  color: #9aa8a8;
  opacity: 1;
}

/* ---------- Input Focus ---------- */
.input:focus-within {
  box-shadow:
    inset 4px 4px 4px rgba(0, 0, 0, 0.3),
    inset -4px -4px 4px rgba(255, 255, 255, 1),
    0 0 0 2px rgba(30, 143, 132, 0.3);
}

/* ---------- Button ---------- */
.login-btn {
  margin-top: 26px;
  width: 100%;
  height: 52px;

  border: none;
  border-radius: 20px;

  font-family: Arial, Helvetica, sans-serif;
  font-size: 23px;
  font-weight: 400;

  color: #1e8f84;
  background: #E6EBF1;

  cursor: pointer;

  box-shadow:
    4px 4px 4px rgba(0, 0, 0, 0.25),
    -4px -4px 4px rgba(255, 255, 255, 1);

  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

.login-btn:hover {
  box-shadow:
    6px 6px 6px rgba(0, 0, 0, 0.28),
    -6px -6px 6px rgba(255, 255, 255, 1);
}

.login-btn:active {
  transform: translateY(1px);
  box-shadow:
    inset 4px 4px 4px rgba(0, 0, 0, 0.3),
    inset -4px -4px 4px rgba(255, 255, 255, 1);
}

/* ---------- Footer ---------- */
.footer {
  position: absolute;
  bottom: 18px;
  width: 100%;
  text-align: center;
  font-size: 15px;
  color: #ffffffcc;
}

</style>
