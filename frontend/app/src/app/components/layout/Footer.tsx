import Image from 'next/image'
import React from 'react'

const Footer = () => {
  return (
    <div className="fixed bottom-1 right-4 m-4 w-16 h-2">
      <Image
        src="/img/authors.png"
        alt="Authors"
        objectFit="cover"
        width={64}
        height={64}
      />
    </div>
  )
}

export default Footer
