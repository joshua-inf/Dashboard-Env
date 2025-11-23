import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import InteractiveSettingsComingSoon from '@/components/settings/Settings'
import React from 'react'

const Page = () => {
  return (
    <div>
      <DefaultLayout>
        <Container>
          <InteractiveSettingsComingSoon />
        </Container>
      </DefaultLayout>
    </div>
  )
}

export default Page