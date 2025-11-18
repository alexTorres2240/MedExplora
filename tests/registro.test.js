import { mount } from '@vue/test-utils'
import Registro from '~/pages/registro.vue'
import { vi } from 'vitest'

// Mock del módulo security
vi.mock('~/utils/security', () => ({
  validateInstitutionalEmail: vi.fn(),
  validatePasswordStrength: vi.fn(),
  hashPassword: vi.fn(),
}))

const {
  validateInstitutionalEmail,
  validatePasswordStrength
} = await import('~/utils/security')

// 🔥 Mock global REAL de Nuxt $fetch
vi.stubGlobal('$fetch', vi.fn())

describe('Registro.vue', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  function mountComponent() {
    return mount(Registro)
  }

  test('renderiza correctamente el formulario', () => {
    const wrapper = mountComponent()

    expect(wrapper.find('input[placeholder="Nombre"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Apellido"]').exists()).toBe(true)
    expect(wrapper.find('input[placeholder="Correo electrónico"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').text()).toBe('Regístrarme')
  })

  test('valida correo institucional inválido', async () => {
    validateInstitutionalEmail.mockResolvedValue({
      ok: false,
      reason: "dominio inválido"
    })

    const wrapper = mountComponent()

    await wrapper.find('input[placeholder="Correo electrónico"]').setValue("test@gmail.com")
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.vm.mensajeReg).toBe("Correo no permitido: dominio inválido")
    expect(wrapper.vm.errorReg).toBe(true)
  })

  test('detecta contraseñas que no coinciden', async () => {
    validateInstitutionalEmail.mockResolvedValue({ ok: true })

    const wrapper = mountComponent()

    await wrapper.find('input[placeholder="Contraseña"]').setValue("123456")
    await wrapper.find('input[placeholder="Confirmar contraseña"]').setValue("000000")
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.vm.mensajeReg).toBe("Las contraseñas no coinciden.")
    expect(wrapper.vm.errorReg).toBe(true)
  })

  test('detecta contraseña débil', async () => {
    validateInstitutionalEmail.mockResolvedValue({ ok: true })

    validatePasswordStrength.mockReturnValue({
      ok: false,
      errors: ["Muy corta"]
    })

    const wrapper = mountComponent()

    await wrapper.find('input[placeholder="Contraseña"]').setValue("123")
    await wrapper.find('input[placeholder="Confirmar contraseña"]').setValue("123")
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.vm.mensajeReg).toBe("Contraseña débil: Muy corta")
    expect(wrapper.vm.errorReg).toBe(true)
  })

  test('registro exitoso', async () => {
    validateInstitutionalEmail.mockResolvedValue({ ok: true })
    validatePasswordStrength.mockReturnValue({ ok: true })

    // 🔥 Mock correcto para Nuxt
    $fetch.mockResolvedValue({
      message: "Usuario registrado correctamente"
    })

    const wrapper = mountComponent()

    await wrapper.find('input[placeholder="Nombre"]').setValue("Juan")
    await wrapper.find('input[placeholder="Apellido"]').setValue("Pérez")
    await wrapper.find('input[placeholder="Correo electrónico"]').setValue("juan@uabc.edu.mx")
    await wrapper.find('input[placeholder="Contraseña"]').setValue("Password123*")
    await wrapper.find('input[placeholder="Confirmar contraseña"]').setValue("Password123*")

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.vm.mensajeReg).toBe("Usuario registrado correctamente")
    expect(wrapper.vm.errorReg).toBe(false)
  })

  test('error del backend durante registro', async () => {
    validateInstitutionalEmail.mockResolvedValue({ ok: true })
    validatePasswordStrength.mockReturnValue({ ok: true })

    // 🔥 Mock que coincide EXACTO con lo que el componente lee
    $fetch.mockRejectedValue({
      response: {
        _data: { message: "Correo ya registrado" }
      }
    })

    const wrapper = mountComponent()

    await wrapper.find('input[placeholder="Correo electrónico"]').setValue("test@uabc.edu.mx")
    await wrapper.find('input[placeholder="Contraseña"]').setValue("Password123*")
    await wrapper.find('input[placeholder="Confirmar contraseña"]').setValue("Password123*")

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.vm.mensajeReg).toBe("Correo ya registrado")
    expect(wrapper.vm.errorReg).toBe(true)
  })

})
