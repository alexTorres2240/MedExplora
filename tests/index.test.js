import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { vi } from 'vitest'
import MyPage from '~/pages/index.vue'

global.fetch = vi.fn()

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

global.localStorage = localStorageMock

describe('IndexPage.vue - Login', () => {
  let router
  let wrapper

  beforeEach(() => {
    vi.clearAllMocks()

    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: MyPage },
        { path: '/HumanModel', component: { template: '<div>Human Model</div>' } },
        { path: '/registro', component: { template: '<div>Registro</div>' } }
      ]
    })
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  // ===== TEST 1 ======
  it ('Renderizado correcto', () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    expect(wrapper.exists()).toBe(true)
  })

  // ===== TEST 2 =====
  it ('Elementos visuales presentes', () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const logos = wrapper.findAll('img')
    expect(logos.length).toBeGreaterThanOrEqual(2)

    const logoMedEx = wrapper.find('.logoMedEx')
    const logoUABC = wrapper.find('.logoUABC')

    expect(logoMedEx.exists()).toBe(true)
    expect(logoUABC.exists()).toBe(true)
  })

  // ===== TEST 3 =====
  it ('Formulario impreso en forma', () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const inputs = wrapper.findAll('input')
    expect(inputs.length).toBe(2)

    const emailInput = inputs[0]
    const passwordInput = inputs[1]

    expect(emailInput.attributes('type')).toBe('email')
    expect(emailInput.attributes('placeholder')).toContain('Correo')
    expect(passwordInput.attributes('placeholder')).toContain('Contraseña')
  })

  // ===== TEST 4 =====
  it('Contraseña ocultada/mostrada', async () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const passwordInput = wrapper.findAll('input')[1]
    const eyeIcon = wrapper.find('.eye-icon')

    expect(passwordInput.attributes('type')).toBe('password')

    await eyeIcon.trigger('click')
    await wrapper.vm.$nextTick()

    expect(passwordInput.attributes('type')).toBe('text')

    await eyeIcon.trigger('click')
    await wrapper.vm.$nextTick()

    expect(passwordInput.attributes('type')).toBe('password')
  })

  // ===== TEST 5 =====
  it ('Extensión isntitucional validada', async () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const inputs = wrapper.findAll('input')
    const emailInput = inputs[0]
    const passwordInput = inputs[1]
    const form = wrapper.find('form')

    await emailInput.setValue('usuario@gmail.com')
    await passwordInput.setValue('Password123*')
    await form.trigger('submit.prevent')
    await wrapper.vm.$nextTick()

    const mensaje = wrapper.find('.mensaje')
    expect(mensaje.exists()).toBe(true)
    expect(mensaje.text()).toContain('correo institucional UABC')
    expect(mensaje.classes()).toContain('error')
  })

  // ===== TEST 6 =====
  it('Extensión institucional validada', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-token-123'})
    })

    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const inputs = wrapper.findAll('input')
    const emailInput = inputs[0]
    const passwordInput = inputs[1]
    const form = wrapper.find('form')

      await emailInput.setValue('estudiante@uabc.edu.mx')
      await passwordInput.setValue('Password123')
      await form.trigger('submit.prevent')
      await wrapper.vm.$nextTick()

      expect (global.fetch).toHaveBeenCalledWith(
        '/api/users/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'estudiante@uabc.edu.mx',
            password: 'Password123'
          })
        })
      )
  })

  // ===== TEST 7 =====
  it('Login, creación de token y redireccionamiento exitosos', async () => {
    const mockToken = 'fake-jwt-token-abc123'

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: mockToken })
    })

    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const pushSpy = vi.spyOn(router, 'push')

    const inputs = wrapper.findAll('input')
    await inputs[0].setValue('estudiante@uabc.edu.mx')
    await inputs[1].setValue('Password123')
    await wrapper.find('form').trigger('submit.prevent')

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', mockToken)
    expect(localStorageMock.setItem).toHaveBeenCalledWith('userEmail', 'estudiante@uabc.edu.mx')

    expect(pushSpy).toHaveBeenCalledWith('/HumanModel')
  })

  // ===== TEST 8 =====
  it('Credenciales incorrectas validadas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Credenciales inválidas' })
    })
      wrapper = mount(MyPage, {
        global: {
          plugins: [router],
          stubs: { NuxtLink: true }
        }
      })

      const inputs = wrapper.findAll('input')
      await inputs[0].setValue('estudiante@uabc.edu.mx')
      await inputs[1].setValue('wrongpassword')
      await wrapper.find('form').trigger('submit.prevent')

      await new Promise(resolve => setTimeout(resolve, 100))

      const mensaje = wrapper.find('.mensaje')
      expect(mensaje.exists()).toBe(true)
      expect(mensaje.classes()).toContain('error')
  })

  // ==== TEST 9 =====
  it('Botón de submit validado', async () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const button = wrapper.find('button[type="submit"]')
    expect(button.exists()).toBe(true)
    expect(button.text()).toBe('Ingresar')
  })

  // ===== TEST 10 ===== 
  it ('Link de registro funcional', () => {
    wrapper = mount(MyPage, {
      global: {
        plugins: [router],
        stubs: { NuxtLink: true}
      }
    })

    const registroText = wrapper.find('.registrarse')
    expect(registroText.exists()).toBe(true)
    expect(registroText.text()).toContain('No tengo una cuenta')
  })
})