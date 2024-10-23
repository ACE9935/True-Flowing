'use client'
import * as React from 'react'
import { ChakraProvider } from '@chakra-ui/react'

function Chakra({ children }:{children:React.ReactNode}) {
  // 2. Wrap ChakraProvider at the root of your app
  return (
    <ChakraProvider>
      {children}
    </ChakraProvider>
  )
}

export default Chakra