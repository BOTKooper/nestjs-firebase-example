import 'reflect-metadata';

interface ICallable {
  pattern: string;
  class: any;
  methodName: string;
}

export const ListOfCallables: ICallable[] = [];

const CheckIsNameLegal = (pattern: string, propertyKey: string) => {
  const RestrictedPatterns = ['http', 'https', 'callable', 'swagger'];

  if(RestrictedPatterns.indexOf(pattern) !== -1) {
    const error = `'${pattern}' name is restricted for Callable at ${propertyKey} - you have to change it`
    console.error(error)
    throw error
  }
}

const CheckIsNameNotContainsIllegalCharacters = (pattern: string, propertyKey: string) => {
  const RestrictedCharacters = [';', ':', '-']
  RestrictedCharacters.forEach((char) => {
    if(pattern.indexOf(char) !== -1) {
      const error = `Illegal character '${char}' in Callable pattern at method ${propertyKey}`;
      console.error(error)
      throw error
    }})
}

const CheckDuplicates = (pattern: string, propertyKey: string) => {
  if(ListOfCallables.find(callable => callable.pattern === pattern)) {
    const error = `You already used '${pattern}' name at ${propertyKey} method - change it`
    console.error(error)
    throw error
  }
}


export function Callable(pattern: string) {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  return function(
    target: any,
    propertyKey: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    descriptor: PropertyDescriptor,
  ) {

    CheckDuplicates(pattern, propertyKey);
    CheckIsNameLegal(pattern, propertyKey);
    CheckIsNameNotContainsIllegalCharacters(pattern, propertyKey)
    
    const callable: ICallable = {
      pattern: pattern,
      class: target.constructor,
      methodName: propertyKey,
    };
    ListOfCallables.push(callable);
  };
}
