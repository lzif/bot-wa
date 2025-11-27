import type { Command } from "../../types/commands";

const truthOrDare: Command = {
  name: "truthordare",
  aliases: ["truth", "dare"],
  category: "Fun",
  description: "Play a game of truth or dare with AI-generated questions.",
  code: async (ctx) => {
    let choice: 'truth' | 'dare';
    const command = ctx.used.command;

    if (command === 'truth' || command === 'dare') {
      choice = command;
    } else {
      choice = Math.random() < 0.5 ? 'truth' : 'dare';
    }

    try {
      await ctx.reply(`🤖 Generating a ${choice} question for you...`);

      const prompt = `Give me a unique and interesting ${choice} question for a game of truth or dare. Do not add a "Truth:" or "Dare:" prefix.`;
      const aiResponse = await tools.ai.text(prompt);

      const message = `${choice.charAt(0).toUpperCase() + choice.slice(1)}: ${aiResponse}`;

      await ctx.reply(message);
    } catch (error) {
      console.error("Error generating AI response:", error);
      await ctx.reply("Sorry, I couldn't come up with a question right now. Please try again later.");
    }
  },
};

export default truthOrDare;
