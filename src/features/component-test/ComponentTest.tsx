import React from 'react'
import SampleComponent from './components/SampleComponent'

const ComponentTest = () => {
  return (
    <React.Fragment>
      <SampleComponent title={'Component 1'} />
      <SampleComponent title={'Component 2'} />
      <SampleComponent title={'Component 3'} />
    </React.Fragment>
  )
}

export default ComponentTest
