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

//example: Carter ics 140, ics-141
export function getArrayOfRoles(
  message: string,
  classPrefixList: string[],
  rolesToBeAssigned: String[]
): string[] {
  let arrayWithClasses: string[] = message.split(" ");
  let arrayOfRoles: string[] = [];
  // first get rid of everything untill the first class prefix
  for (const messageElement of arrayWithClasses) {
    if (hasClassPrefix(messageElement, classPrefixList)) {
      break;
    }
    arrayWithClasses.shift();
  }

  for (const messageElement of arrayWithClasses) {
    // element is a recognized class role
    if (rolesToBeAssigned.includes(messageElement)) {
      arrayOfRoles.push(messageElement);
    }
    // has a class prefix
    else if (classPrefixList.includes(messageElement)) {
    }
  }

  return arrayOfRoles;
}
