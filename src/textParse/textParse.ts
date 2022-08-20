export function hasClassPrefix(
  messageElement: string,
  classPrefixList: string[]
) {
  let textArray = messageElement.split("");
  let hasClassPrefix = false;
  let prefix = "";

  for (const text of textArray) {
    // there is a dash or a space or a number then break the loop
    if (text === "-" || text === " " || !isNaN(Number(text))) {
      console.log(`prefix: ${prefix}`);
      break;
    }
    prefix += text.toUpperCase();
  }

  if (classPrefixList.includes(prefix)) {
    hasClassPrefix = true;
  }

  return hasClassPrefix;
}

export function insertionSort(inputArr: any[]) {
  let n = inputArr.length;
  for (let i = 1; i < n; i++) {
    // Choosing the first element in our unsorted subarray
    let current = inputArr[i];
    // The last element of our sorted subarray
    let j = i - 1;
    while (j > -1 && current.localeCompare(inputArr[j]) < 0) {
      inputArr[j + 1] = inputArr[j];
      j--;
    }
    inputArr[j + 1] = current;
  }
  return [inputArr];
}
