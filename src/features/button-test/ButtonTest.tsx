import React from 'react'
import Button from './component/Button'

const ButtonTest: React.FC = () => {
  return (
    <React.Fragment>
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button size="small">Small</Button>
      <Button size="large">Large</Button>
    </React.Fragment>
  )
}
export default ButtonTest
