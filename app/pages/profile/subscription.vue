<script lang="ts" setup>

</script>

<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar title="Subscription">
      </UDashboardNavbar>
      <UDashboardPanelContent class="pb-24">
        <UDashboardSection
          title="Subscription Details"
          description="Manage your subscription and billing information"
        >
          <template #links>
            <UButton label="Manage billing info" size="sm" variant="outline" />
          </template>
        </UDashboardSection>

        <UDivider />

        <UDashboardSection
          title="Current Plan"
          description="You are currently running plan"
        >
          <template #links>
            <UBadge color="gray" size="lg">
              Free
            </UBadge>
          </template>
        </UDashboardSection>

        <UDivider />

        <UDashboardSection
          title="Subscription Status"
          description="Your current subscription status"
        >
          <template #links>
            <UBadge color="green" size="lg">
              Active
            </UBadge>
          </template>
        </UDashboardSection>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<style></style>
