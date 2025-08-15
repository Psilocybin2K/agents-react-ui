// Date-Time Chat Send Plugin
// Prefixes outgoing user messages with the current local date/time.

const dateTimePlugin = {
  /**
   * @param {{ chatId: string, content: string, options: object, ctx: object }} args
   */
  async beforeSend({ content }) {
    const stamp = new Date().toLocaleString();
    const prefixed = `[${stamp}]\n${String(content ?? '')}`;
    return { content: prefixed };
  },
};

export default dateTimePlugin;
export { dateTimePlugin };


