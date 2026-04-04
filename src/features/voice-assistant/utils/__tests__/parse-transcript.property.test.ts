import { parseTranscript } from '../parse-transcript';

describe('parseTranscript', () => {
  const cases: [string, { title: string; amount: number }][] = [
    ['dois arroz', { title: 'arroz', amount: 2 }],
    ['10 massa de tomate', { title: 'massa de tomate', amount: 10 }],
    ['arroz dois', { title: 'arroz', amount: 2 }],
    ['vinte e um pão de forma', { title: 'pão de forma', amount: 21 }],
    ['arroz', { title: 'arroz', amount: 1 }],
    ['duzentos e cinquenta gramas de queijo', { title: 'gramas de queijo', amount: 250 }],
    ['um litro de leite', { title: 'litro de leite', amount: 1 }],
    ['três ovos', { title: 'ovos', amount: 3 }],
    ['100 parafusos', { title: 'parafusos', amount: 100 }],
    ['manteiga cinco', { title: 'manteiga', amount: 5 }],
    ['', { title: '', amount: 1 }],
  ];

  test.each(cases)('parses "%s"', (input, expected) => {
    expect(parseTranscript(input)).toEqual(expected);
  });
});
