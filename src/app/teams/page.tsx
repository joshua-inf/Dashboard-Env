import Container from '@/components/Layouts/Container'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import TeamMembersPage from '@/components/teams/mockTeamMembers '
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultLayout>
        <Container>
          <TeamMembersPage />
        </Container>
      </DefaultLayout>
    </Suspense>
  )
}

export default page