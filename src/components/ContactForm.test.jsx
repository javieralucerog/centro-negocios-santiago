import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, test, vi } from 'vitest'
import ContactForm from './ContactForm.jsx'

describe('ContactForm', () => {
  test('muestra un mensaje si el nombre tiene menos de 2 caracteres', async () => {
    const user = userEvent.setup()

    const services = [
      {
        id: 'asesoria',
        title: 'Asesoría para tu negocio',
      },
    ]

    render(
      <ContactForm
        services={services}
        selectedService="asesoria"
        onServiceChange={vi.fn()}
      />
    )

    await user.type(
      screen.getByLabelText('Nombre'),
      'A'
    )

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'prueba@ejemplo.cl'
    )

    await user.type(
      screen.getByLabelText('Mensaje'),
      'Este es un mensaje de prueba'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Enviar consulta de prueba',
      })
    )

    expect(
      screen.getByText(
        'Ingresa un nombre con al menos 2 caracteres.'
      )
    ).toBeInTheDocument()
  })

  test('muestra un mensaje si el mensaje tiene menos de 10 caracteres', async () => {
    const user = userEvent.setup()

    const services = [
      {
        id: 'asesoria',
        title: 'Asesoría para tu negocio',
      },
    ]

    render(
      <ContactForm
        services={services}
        selectedService="asesoria"
        onServiceChange={vi.fn()}
      />
    )

    await user.type(
      screen.getByLabelText('Nombre'),
      'Javiera'
    )

    await user.type(
      screen.getByLabelText('Correo electrónico'),
      'prueba@ejemplo.cl'
    )

    await user.type(
      screen.getByLabelText('Mensaje'),
      'Hola'
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Enviar consulta de prueba',
      })
    )

    expect(
      screen.getByText(
        'Escribe un mensaje con al menos 10 caracteres.'
      )
    ).toBeInTheDocument()
  })
})