import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock router
const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  beforeEach: vi.fn(),
  afterEach: vi.fn(),
  currentRoute: { 
    value: { 
      path: '/',
      params: {},
      query: {},
      meta: {}
    } 
  },
  options: {
    history: {},
    routes: [
      { path: '/inicio', name: 'inicio' },
      { path: '/HumanModel', name: 'HumanModel' }
    ]
  }
}

// Global mocks
config.global.mocks = {
  $router: mockRouter,
  $route: mockRouter.currentRoute.value
}

config.global.provide = {
  [Symbol.for('router')]: mockRouter,
  router: mockRouter
}

config.global.stubs = {
  NuxtLink: {
    name: 'NuxtLink',
    template: '<a><slot /></a>',
    props: ['to']
  }
}

// Declarar $fetch global (sin implementación)
global.$fetch = vi.fn()
