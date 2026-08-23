<x-mail::message>
# Hello!

You have been invited to join the **{{ config('app.name') }}** team with the role of **{{ $invitation->role->name }}**.

Click the button below to accept your invitation and set up your account:

<x-mail::button :url="url('/register?token=' . $invitation->token)">
Accept Invitation
</x-mail::button>

This invitation will expire on {{ $invitation->expires_at->format('M d, Y') }}.

If you did not expect this invitation, you can safely ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
