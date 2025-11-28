export class Log {
	private static getTimestamp(): string {
		return new Date().toLocaleTimeString("en-US", { hour12: false });
	}

	private static formatMessage(
		level: string,
		emoji: string,
		service: string,
		message: any
	): void {
		const timestamp = this.getTimestamp();
		const msgString =
			message instanceof Error ? message.message : String(message);
		console.log(
			`${emoji} ${timestamp} — ${level.toUpperCase()} [${service}] ${msgString}`
		);
		if (message instanceof Error && message.stack) {
			console.error(message.stack);
		}
	}

	public static info(service: string, message: any): void {
		this.formatMessage("info", "✨", service, message);
	}

	public static warn(service: string, message: any): void {
		this.formatMessage("warn", "⚠️", service, message);
	}

	public static error(service: string, message: any): void {
		this.formatMessage("error", "❌", service, message);
	}
}
