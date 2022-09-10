export default function formatClassNames(splitMessageWithoutName: string[]) {
  for (let index = 0; index < splitMessageWithoutName.length; index++) {
    const messageElement = splitMessageWithoutName[index];

    if (messageElement.includes("-")) continue;

    let classNameEdit = ``;
    let readingNumber = false;
    for (const element of messageElement.split("")) {
      if (!readingNumber && !isNaN(Number(element))) {
        //if it is a number
        classNameEdit += `-`;
        readingNumber = true;
      }

      classNameEdit += element;
    }

    splitMessageWithoutName[index] = classNameEdit;
  }
}
