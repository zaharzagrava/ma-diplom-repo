import * as _ from 'lodash'

export const omitByRecursively = (
  value: any,
  {
    ignoreIteratee = (x) => false,
    iteratee = (x) =>
      _.isUndefined(x) ||
      _.isNull(x) ||
      _.isNaN(x) ||
      (_.isString(x) && _.isEmpty(x)),
  }: {
    ignoreIteratee?: (x: any) => boolean;
    iteratee?: (x: any) => boolean;
  } = {},
) => {
  if (_.isObject(value) && !ignoreIteratee(value)) {
    if (_.isArray(value)) {
      return (_ as any)(value) 
        .omitBy(iteratee)
        .map((v: any) => omitByRecursively(v, { iteratee, ignoreIteratee }))
        .value();
    } else {
      return (_ as any)(value)
        .omitBy(iteratee)
        .mapValues((v: any, key: any) => {
          if (ignoreIteratee(key)) return v;
          return omitByRecursively(v, { iteratee, ignoreIteratee });
        })
        .value();
    }
  } else {
    return value;
  }
}
