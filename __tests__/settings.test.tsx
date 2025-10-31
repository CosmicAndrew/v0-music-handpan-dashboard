
import { render, screen, fireEvent } from '@testing-library/react'
import { Settings } from '../components/settings'

describe('Settings', () => {
  it('should switch themes when the theme buttons are clicked', () => {
    const setTheme = jest.fn()
    render(<Settings theme="light" setTheme={setTheme} />)

    const darkButton = screen.getByRole('button', { name: /dark/i })
    fireEvent.click(darkButton)
    expect(setTheme).toHaveBeenCalledWith('dark')

    const lightButton = screen.getByRole('button', { name: /light/i })
    fireEvent.click(lightButton)
    expect(setTheme).toHaveBeenCalledWith('light')

    const systemButton = screen.getByRole('button', { name: /system/i })
    fireEvent.click(systemButton)
    expect(setTheme).toHaveBeenCalledWith('system')
  })
})
