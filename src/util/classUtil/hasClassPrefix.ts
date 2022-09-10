export default function hasClassPrefix(
  messageElement: string,
  classPrefixList: string[]
) {
  let textArray = messageElement.split("");
  let hasClassPrefix = false;
  let prefix = "";

  for (const text of textArray) {
    // there is a dash or a space or a number then break the loop
    if (text === "-" || text === " " || !isNaN(Number(text))) {
      break;
    }
    prefix += text.toUpperCase();
  }

  if (classPrefixList.includes(prefix)) {
    hasClassPrefix = true;
  }

  return hasClassPrefix;
}
