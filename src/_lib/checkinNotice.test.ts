import { describe, expect, it } from 'vitest';
import { checkinNoticeMessage } from './checkinNotice';

describe('checkinNoticeMessage', () => {
  it('UT-138 is a neutral sentence with no digit and no financial or delinquency wording', () => {
    const message = checkinNoticeMessage('SEE_ADMINISTRATION');

    expect(message).toBe('Oriente o aluno a passar pela administração.');
    expect(message).not.toMatch(/\d/);
    expect(message).not.toMatch(
      /R\$|atras|inadimpl|devi|débito|dívid|pagament|valor|mensalidade|cobran/i
    );
  });
});
