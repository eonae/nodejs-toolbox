# Полезные утилиты

### Конвертация

Нэймспейс Convert предоставляет статические методы приведения к int, float и boolean.

``` typescript
  import { Convert } from '@eonae/common';

  const n = Convert.int(stringThatShouldBeAnInteger);
```

### Конфигурация

Абстрактный класс __ConfigurationReader__ и его реализация - класс __ProcessEnv__ предоставляет удобный механизм создания объектов конфигурации со встроенной простой валидацией:

``` typescript
  import dotenv from 'dotenv';
  import { ProcessEnv } from '@eonae/common';

  dotenv.config();
  const env = new ProcessEnv(); // Реализует ConfigurationReader

  export const config = {
    // Последний необязательный аргумент - значение по умолчанию
    port: env.getNumber('PORT', 8080),
    host: env.getString('HOST'),
    disableAuth: env.getBoolean('DISABLE_AUTH'),
    logFormat: env.getEnumValue('LOG_FORMAT', LogFormat, LogFormat.warn)
  }
```

В случае отсутствия нужного параметра в источнике конфигурации (если не указано значение по умолчанию) будет выброшен __ConfigurationError__. Также ошибка вылетит, если не удастся привести значение к нужному формату.

Можно реализовывать __ConfigurationReader__ иначе, переопределяя метод get(key: string), например, используя в качестве источника конфигурации json, yaml файлы и т. п.

### Экстракция

Функция __readObj__ (и __readObjSync__) даёт возможность в одну строчку читать json и yaml и .env файлы, сразу предоставляя вызывающему коду информацию в виду объекта.

``` typescript
  import { readObjSync } from '@eonae/common';
  import { join } from 'path';

  var filepath = join(__dirname, './urls.json')
  const urls = readObjSync(filepath);
  // use urls.getDrivers and other urls in code
```

### Таймеры

Класс __Stopwatch__ помогает удобно и с точностью до миллисекунды измерять время выполнения кода.

``` typescript
  import { Stopwatch } from '@eonae/common';

  const sw = new Stopwatch();
  sw.Start();

  // Do something

  console.log(sw.elapsedMilliseconds); // Распечатает количество прошедших миллисекунд
```

### Дата и время

Комбинирует библиотеки __moment__ и __moment-range__ (удобная работа с периодами времени)

``` typescript
  import { xmoment } from '@eonae/common';

  const period = xmoment.range(new Date(...), new Date(...))
```
См. документацию пакета __moment-range__:
https://github.com/rotaready/moment-range

### Http service wrapper

В разработке...


### Прочее

``` typescript
  await delay(1000); // will wait for 1 second
```


