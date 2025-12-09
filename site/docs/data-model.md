---
---

# Data Model

This guide introduces the core resource types available in SavvyCal Appointments to help you plan your integration.

## Accounts

An [`Account`](/api/schemas/account) represents an organization in SavvyCal and serves as the core tenancy boundary for all resources in the system.

## Providers

A [`Provider`](/api/schemas/provider) represents a staff member who provides services to clients. Providers are managed in the [Staff](https://savvycal.app/providers) section of the SavvyCal Dashboard.

Key properties of a provider include:

| Property       | Type   | Description                                                                                       |
| -------------- | ------ | ------------------------------------------------------------------------------------------------- |
| `id`           | string | The unique identifier for the provider (e.g., `prov_d025a96ac0c6`).                                |
| `first_name`   | string | The first name of the provider.                                                                   |
| `last_name`    | string | The last name of the provider.                                                                    |
| `display_name` | string | The display name of the provider, including any title or designations (e.g., "Dr. Evelyn Brooks"). |

See the [Provider](/api/schemas/provider) schema for complete details.

## Services

A [`Service`](/api/schemas/service) represents a service offered by one or more [`Providers`](/api/schemas/provider).

![Service relationships](/img/service-relationships.png)

You can add one or more providers to a service (via the SavvyCal Dashboard or the [Add provider to service API](/api/create-service-provider)).

Key properties of a service include:

| Property     | Type                                       | Description                                                                                                                                     |
| ------------ | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | string                                     | The unique identifier for the service (e.g., `srv_d025a96ac0c6`).                                                                                |
| `name`       | string                                     | The name of the service.                                                                                                                        |
| `duration`   | string                                     | The duration of the service in ISO-8601 duration format (e.g., `PT30M`, `PT1H30M`).                                                              |
| `slot_rules` | array of [SlotRule](/api/schemas/slotrule) | The rules that define the time slots available for the service (e.g., Monday through Friday, 9:00 AM - 5:00 PM, at the top of each hour). |

See the [Service](/api/schemas/service) schema for complete details.

When calculating available time slots for a service provider, the system uses this logic:

1. Generate all time slots defined by the slot rules for the service.
2. Remove any time slots that are already booked, are marked as unavailable with a block, or fall outside the provider's configured working hours.

## Clients

A [`Client`](/api/schemas/client) represents a person who has made (or will make) appointments with a [`Provider`](/api/schemas/provider) for a particular [`Service`](/api/schemas/service). SavvyCal uses the generic term "client" to remain industry-agnostic. For example, in healthcare contexts, a client is typically called a patient.

Key properties of a client include:

| Property     | Type   | Description                                                                                                                                     |
| ------------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`         | string | The unique identifier for the client (e.g., `clnt_d025a96ac0c6`).                                                                                |
| `reference_id` | string | The external reference identifier for the client—typically a primary key from your database that corresponds to the client.                                                |
| `first_name` | string | The first name of the client.                                                                                                                   |
| `last_name`  | string | The last name of the client.                                                                                                                    |
| `email`      | string | The email address of the client.                                                                                                                |
| `phone`      | string | The phone number of the client.                                                                                                  |
| `time_zone`  | string | The time zone of the client (IANA format).                                                                                                      |

See the [Client](/api/schemas/client) schema for complete details.

## Appointments

An [`Appointment`](/api/schemas/appointment) represents a booking that a [`Client`](/api/schemas/client) has made with a [`Provider`](/api/schemas/provider) for a particular [`Service`](/api/schemas/service).

![Appointment relationships](/img/appointment-relationships.png)

Key properties of an appointment include:

| Property              | Type                                        | Description                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `id`                  | string                                      | The unique identifier for the appointment (e.g., `appt_d025a96ac0c6`).                                                                                                                                       |
| `status`              | enum                                        | The status of the appointment—either `scheduled` or `cancelled`.                                                                                                                                    |
| `client_reference_id` | string                                      | The external reference identifier for the client—typically a primary key from your database that corresponds to the client who made the appointment.                                                |
| `client_time_zone`    | string                                      | The client's time zone (IANA format). This field represents the appointment time slot in the client's local time zone when it differs from the appointment's local time zone. |
| `start_at`            | [ZonedDateTime](/api/schemas/zoneddatetime) | The start time of the appointment.                                                                                                                                                                          |
| `end_at`              | [ZonedDateTime](/api/schemas/zoneddatetime) | The end time of the appointment.                                                                                                                                                                            |
| `fields`              | object                                      | A map of client data provided when the appointment was created (`email`, `first_name`, `last_name`, `phone`).                                                                                               |

See the [Appointment](/api/schemas/appointment) schema for complete details.

Appointments can be created via the [Create appointment API](/api/create-appointment) or the [SavvyCal Booking Embed](/embedding/booking-embed).
