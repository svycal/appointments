# @savvycal/appointments-react-query

React Query hooks for the [SavvyCal Appointments API](https://developers.savvycal.app).

## Installation

```bash
npm install @savvycal/appointments-react-query @tanstack/react-query
```

### Peer Dependencies

- `@tanstack/react-query` ^5.0.0
- `react` ^18.0.0 || ^19.0.0

## Usage

### Setting Up the Provider

Wrap your application with `SavvyCalProvider` and `QueryClientProvider`:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SavvyCalProvider } from "@savvycal/appointments-react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SavvyCalProvider
        fetchAccessToken={async () => {
          // Return a JWT access token
          return "your-jwt-token";
        }}
      >
        <YourApp />
      </SavvyCalProvider>
    </QueryClientProvider>
  );
}
```

### Query Hooks

Use query hooks to fetch data:

```tsx
import {
  useAppointment,
  useServices,
} from "@savvycal/appointments-react-query";

function AppointmentDetails({ appointmentId }: { appointmentId: string }) {
  const { data, isLoading, error } = useAppointment(appointmentId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading appointment</div>;

  return <div>{data?.appointment.start_time}</div>;
}

function ServiceList() {
  const { data, isLoading } = useServices();

  if (isLoading) return <div>Loading...</div>;

  return (
    <ul>
      {data?.services.map((service) => (
        <li key={service.id}>{service.name}</li>
      ))}
    </ul>
  );
}
```

### Mutation Hooks

Use mutation hooks to create, update, or delete data:

```tsx
import {
  useCancelAppointment,
  useCreateAppointment,
} from "@savvycal/appointments-react-query";

function CancelButton({ appointmentId }: { appointmentId: string }) {
  const { mutate: cancel, isPending } = useCancelAppointment();

  return (
    <button
      onClick={() =>
        cancel({
          params: { path: { appointment_id: appointmentId } },
          body: { reason: "Schedule conflict" },
        })
      }
      disabled={isPending}
    >
      {isPending ? "Canceling..." : "Cancel Appointment"}
    </button>
  );
}

function BookingForm({ serviceId }: { serviceId: string }) {
  const { mutate: createAppointment, isPending } = useCreateAppointment();

  const handleSubmit = (formData: FormData) => {
    createAppointment({
      body: {
        service_id: serviceId,
        start_time: formData.get("startTime") as string,
        client: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
        },
      },
    });
  };

  // ...
}
```

### Accessing Clients Directly

You can access the underlying clients via hooks:

```tsx
import {
  useSavvyCalFetchClient,
  useSavvyCalQueryClient,
} from "@savvycal/appointments-react-query";

function CustomComponent() {
  const fetchClient = useSavvyCalFetchClient();
  const queryClient = useSavvyCalQueryClient();

  // Use fetchClient for direct API calls
  // Use queryClient for custom queries/mutations
}
```

## Available Hooks

### Query Hooks

| Hook                           | Description                      |
| ------------------------------ | -------------------------------- |
| `useAccountById`               | Get account by ID                |
| `useAccounts`                  | List accounts                    |
| `useAccountUsers`              | List account users               |
| `useAppointment`               | Get appointment by ID            |
| `useAppointments`              | List appointments                |
| `useBlock`                     | Get block by ID                  |
| `useBlocks`                    | List blocks                      |
| `useCancellationReason`        | Get cancellation reason by ID    |
| `useCancellationReasons`       | List cancellation reasons        |
| `useClient`                    | Get client by ID                 |
| `useClients`                   | List clients                     |
| `useCurrentAccount`            | Get current account              |
| `useCurrentAccountUser`        | Get current account user         |
| `useCurrentPlatform`           | Get current platform             |
| `useEarliestPublicServiceSlot` | Get earliest available slot      |
| `useProvider`                  | Get provider by ID               |
| `useProviders`                 | List providers                   |
| `useProviderSchedule`          | Get provider schedule by ID      |
| `useProviderSchedules`         | List provider schedules          |
| `usePublicAppointment`         | Get public appointment by ID     |
| `usePublicCancellationReasons` | List public cancellation reasons |
| `usePublicServiceSlots`        | List public service slots        |
| `useRoles`                     | List roles                       |
| `useService`                   | Get service by ID                |
| `useServices`                  | List services                    |
| `useServiceProviders`          | List service providers           |
| `useServiceSlots`              | List service slots               |

### Mutation Hooks

| Hook                             | Description                     |
| -------------------------------- | ------------------------------- |
| `useCancelAppointment`           | Cancel an appointment           |
| `useCancelPublicAppointment`     | Cancel a public appointment     |
| `useConfirmAppointment`          | Confirm an appointment          |
| `useCreateAccount`               | Create an account               |
| `useCreateAccountUser`           | Create an account user          |
| `useCreateAppointment`           | Create an appointment           |
| `useCreateBlock`                 | Create a block                  |
| `useCreateCancellationReason`    | Create a cancellation reason    |
| `useCreateClient`                | Create a client                 |
| `useCreateDashboardSession`      | Create a dashboard session      |
| `useCreateProvider`              | Create a provider               |
| `useCreateProviderSchedule`      | Create a provider schedule      |
| `useCreatePublicAppointment`     | Create a public appointment     |
| `useCreateService`               | Create a service                |
| `useCreateServiceProvider`       | Create a service provider       |
| `useDeactivateProvider`          | Deactivate a provider           |
| `useDeleteBlock`                 | Delete a block                  |
| `useDeleteCancellationReason`    | Delete a cancellation reason    |
| `useDeleteClient`                | Delete a client                 |
| `useDeleteProviderSchedule`      | Delete a provider schedule      |
| `useDeleteService`               | Delete a service                |
| `useDeleteServiceProvider`       | Delete a service provider       |
| `useRescheduleAppointment`       | Reschedule an appointment       |
| `useReschedulePublicAppointment` | Reschedule a public appointment |
| `useUpdateAccount`               | Update an account               |
| `useUpdateBlock`                 | Update a block                  |
| `useUpdateCancellationReason`    | Update a cancellation reason    |
| `useUpdateClient`                | Update a client                 |
| `useUpdateProvider`              | Update a provider               |
| `useUpdateProviderSchedule`      | Update a provider schedule      |
| `useUpdateService`               | Update a service                |

## License

MIT
