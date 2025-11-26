import type { Command } from "../../types/commands";

const truthOrDare: Command = {
  name: "truthordare",
  aliases: ["truth", "dare"],
  category: "Fun",
  description: "Play a game of truth or dare.",
  code: async (ctx) => {
    const truths = [
      "When was the last time you lied?",
      "What is your biggest fear?",
      "What is the most embarrassing thing you've ever done?",
      "Have you ever cheated on a test?",
      "What is a secret you've never told anyone?",
      "What's the most childish thing you still do?",
      "What's the worst gift you've ever received?",
      "Have you ever peed in a pool?",
      "What's the weirdest thing you've ever eaten?",
      "What's a secret you've kept from your parents?",
    ];

    const dares = [
      "Sing a song out loud.",
      "Do 10 push-ups.",
      "Send a funny selfie to the fifth person on your contact list.",
      "Talk in a funny accent for the next 10 minutes.",
      "Let someone else in the group post a status on your behalf.",
      "Eat a spoonful of a condiment.",
      "Post an old selfie on your story.",
      "Send a voice message to your crush.",
      "Let the group choose a new profile picture for you.",
      "Do a silly dance for 30 seconds.",
    ];

    let choice: 'truth' | 'dare';
    const command = ctx.used.command;

    if (command === 'truth' || command === 'dare') {
      choice = command;
    } else {
      choice = Math.random() < 0.5 ? 'truth' : 'dare';
    }

    const list = choice === 'truth' ? truths : dares;
    const item = list[Math.floor(Math.random() * list.length)];
    const message = `${choice.charAt(0).toUpperCase() + choice.slice(1)}: ${item}`;

    await ctx.reply(message);
  },
};

export default truthOrDare;
