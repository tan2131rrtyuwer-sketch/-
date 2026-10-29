# Security Specification: Real-Time Chat System

## 1. Data Invariants
- **Conversation Participant Invariant**: Only authenticated users whose UID is listed in `participantIds` can read, query, or receive real-time message updates from a conversation.
- **Identity Invariant**: The `senderId` of any created message MUST strictly match `request.auth.uid`. No user can spoof another user's identity.
- **Message Integrity**: Messages are immutable once created. Only the recipient may update the `status` (`delivered`, `read`) and `readAt` timestamp.
- **Volumetric Bound**: Message text must be non-empty and must not exceed 2,000 characters.
- **Zero Orphaned Subcollections**: Messages can only be created under an existing, valid parent conversation where the author is a verified participant.

## 2. The "Dirty Dozen" Threat Payloads
1. **Identity Spoofing**: Attempt to send a message with `senderId: "victim_user"` while authenticated as `attacker_user`. (DENIED: `incoming().senderId == request.auth.uid`)
2. **Eavesdropping on Private Chat**: Unauthenticated or third-party user attempts to read `/conversations/{id}/messages`. (DENIED: Master Gate `isConversationParticipant(conversationId)`)
3. **Denial-of-Wallet (Oversized Payload)**: Attacker attempts to send a 500KB text payload. (DENIED: `incoming().text.size() <= 2000`)
4. **Message Text Tampering**: Sender attempts to change the text of an already sent message after the recipient read it. (DENIED: update only allows `['status', 'readAt']`)
5. **Sender Tampering with Read Receipts**: Sender attempts to update their own message status to `read`. (DENIED: `existing().senderId != request.auth.uid`)
6. **Self-Chat Injection**: Attacker attempts to create a conversation with only 1 participant or 3+ participants. (DENIED: `incoming().participantIds.size() == 2`)
7. **Document ID Path Injection**: Injecting malicious, multi-kilobyte non-alphanumeric IDs into `{conversationId}` or `{messageId}`. (DENIED: `isValidId()`)
8. **Public Blanket Read on Conversations**: Unauthenticated query listing all conversations. (DENIED: `isSignedIn() && request.auth.uid in resource.data.participantIds`)
9. **Fake Report Injection**: Unauthenticated user submitting spam reports. (DENIED: `isSignedIn() && incoming().reporterId == request.auth.uid`)
10. **Ghost Field Injection in User Profile**: Setting unauthorized admin flags in `/users/{userId}`. (DENIED: strict key & role validation)
11. **Conversation Hijacking**: Changing the `participantIds` of an existing conversation to lock out the other participant. (DENIED: `incoming().participantIds == existing().participantIds`)
12. **Public Write to Root Documents**: Any write outside defined collections. (DENIED: default-deny catch-all rule)
