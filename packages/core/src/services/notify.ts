export interface NotificationService {
  sendAlert(title: string, message: string, priority?: 'low' | 'default' | 'high' | 'urgent'): Promise<void>;
  sendApprovalPrompt(
    brandName: string,
    contentTitle: string,
    approvalUrl: string
  ): Promise<void>;
}

export class NtfyNotificationService implements NotificationService {
  private serverUrl: string;
  private topic: string;

  constructor(topic?: string, serverUrl: string = 'https://ntfy.sh') {
    this.topic = topic || process.env.NTFY_TOPIC || 'creator-autopilot-alerts-default';
    this.serverUrl = serverUrl || process.env.NTFY_SERVER_URL || 'https://ntfy.sh';
  }

  async sendAlert(
    title: string,
    message: string,
    priority: 'low' | 'default' | 'high' | 'urgent' = 'default'
  ): Promise<void> {
    const endpoint = `${this.serverUrl}/${this.topic}`;
    const priorityMap = { low: '2', default: '3', high: '4', urgent: '5' };

    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          Title: title,
          Priority: priorityMap[priority],
          Tags: priority === 'urgent' ? 'warning,rotating_light' : 'information_source',
        },
        body: message,
      });
    } catch (err) {
      console.warn('Failed to dispatch Ntfy notification:', err);
    }
  }

  async sendApprovalPrompt(
    brandName: string,
    contentTitle: string,
    approvalUrl: string
  ): Promise<void> {
    const endpoint = `${this.serverUrl}/${this.topic}`;
    try {
      await fetch(endpoint, {
        method: 'POST',
        headers: {
          Title: `Review Required: ${brandName}`,
          Priority: '4', // High priority
          Tags: 'clapper,bell',
          Actions: `view, Open Review Queue, ${approvalUrl}`,
        },
        body: `New video rendered and ready for review: "${contentTitle}"`,
      });
    } catch (err) {
      console.warn('Failed to dispatch Ntfy approval notification:', err);
    }
  }
}
