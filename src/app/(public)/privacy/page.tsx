import {
  LegalPageLayout,
  LegalSection,
} from '@/_components/legal/legalPageLayout';
import { Card } from '@/_components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description:
    'Como a Vita Flow coleta, usa e protege seus dados pessoais e de saúde, e quais direitos você tem sobre eles, conforme a LGPD.',
};

const TOC = [
  { id: 'quem-somos', label: '1. Quem somos' },
  { id: 'dados-coletados', label: '2. Dados que coletamos' },
  { id: 'para-que-usamos', label: '3. Para que usamos' },
  { id: 'base-legal', label: '4. Base legal' },
  { id: 'compartilhamento', label: '5. Com quem compartilhamos' },
  { id: 'cookies', label: '6. Cookies' },
  { id: 'retencao', label: '7. Por quanto tempo guardamos' },
  { id: 'seguranca', label: '8. Como protegemos' },
  { id: 'direitos', label: '9. Seus direitos' },
  { id: 'menores', label: '10. Menores de idade' },
  { id: 'alteracoes', label: '11. Alterações' },
  { id: 'contato', label: '12. Contato e encarregado' },
];

export default function Privacy() {
  return (
    <LegalPageLayout
      title="Política de Privacidade"
      updatedAt="18 de setembro de 2026"
      toc={TOC}
    >
      <LegalSection id="quem-somos" number="01" title="Quem somos">
        {/* TODO: razão social e CNPJ reais da empresa — preencher antes de publicar. */}
        <p>
          <strong>Vita Flow Tecnologia Ltda.</strong>, inscrita no CNPJ sob o nº
          00.000.000/0001-00, com sede na R. Escritório da Vita Flow, 234, São
          Miguel do Oeste - SC (&quot;Vita Flow&quot;, &quot;nós&quot;), é a
          controladora dos dados pessoais tratados através da plataforma Vita
          Flow. Esta política explica quais dados coletamos de você — usuário,
          educador físico ou nutricionista —, como usamos, com quem
          compartilhamos e quais direitos você tem sobre eles, nos termos da Lei
          Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).
        </p>
      </LegalSection>

      <LegalSection
        id="dados-coletados"
        number="02"
        title="Quais dados coletamos"
      >
        <p>
          <strong>Dados de cadastro:</strong> nome, e-mail, senha (armazenada
          com hash, nunca em texto puro) e, quando você usa &quot;Continuar com
          Google&quot;, o identificador da sua conta Google e a confirmação de
          que o Google verificou seu e-mail.
        </p>
        <p>
          <strong>Dados de saúde (categoria sensível):</strong> peso, altura,
          IMC, medidas corporais, treinos, planos alimentares e qualquer
          anotação de evolução que você registrar. Tratamos esses dados com
          controles adicionais e apenas com sua autorização específica, conforme
          o art. 11 da LGPD.
        </p>
        <p>
          <strong>Dados de pagamento:</strong> ao assinar um plano pago, o
          processamento é feito pelo Stripe, nosso parceiro de pagamentos — a
          Vita Flow não armazena número de cartão de crédito.
        </p>
        <p>
          <strong>Dados técnicos e de sessão:</strong> endereço IP,
          identificadores de sessão e cookies estritamente necessários para
          manter você conectado (ver seção 6).
        </p>
      </LegalSection>

      <LegalSection
        id="para-que-usamos"
        number="03"
        title="Para que usamos seus dados"
      >
        <ul>
          <li>
            Criar e manter sua conta, e autenticar seu login (por senha ou
            Google).
          </li>
          <li>
            Exibir seus treinos, planos alimentares e o histórico de evolução
            que você mesmo registra.
          </li>
          <li>
            Conectar você ao educador físico ou nutricionista responsável pelo
            seu acompanhamento.
          </li>
          <li>Processar pagamentos e gerenciar sua assinatura.</li>
          <li>
            Enviar comunicações operacionais (confirmação de cadastro, ativação
            de conta, avisos de segurança como vinculação de login social).
          </li>
          <li>Detectar e prevenir fraude, abuso e acesso não autorizado.</li>
          <li>Cumprir obrigações legais e regulatórias.</li>
        </ul>
        <p>
          Não usamos seus dados de saúde para publicidade, e não vendemos dados
          pessoais a terceiros.
        </p>
      </LegalSection>

      <LegalSection
        id="base-legal"
        number="04"
        title="Base legal para cada tratamento"
      >
        <p>
          Tratamos seus dados de cadastro e de uso com base na{' '}
          <strong>execução de contrato</strong> (art. 7º, V) — é o que permite a
          própria existência do serviço. Dados de saúde são tratados apenas com
          seu <strong>consentimento específico e destacado</strong> (art. 11,
          I), que você pode revogar a qualquer momento sem custo. Usamos{' '}
          <strong>legítimo interesse</strong> (art. 7º, IX) para prevenção a
          fraude e segurança, e <strong>cumprimento de obrigação legal</strong>{' '}
          (art. 7º, II) quando exigido por lei ou autoridade competente.
        </p>
      </LegalSection>

      <LegalSection
        id="compartilhamento"
        number="05"
        title="Com quem compartilhamos"
      >
        <p>
          Compartilhamos dados apenas com operadores estritamente necessários
          para operar o serviço, sempre sob contrato de confidencialidade e
          proteção de dados:
        </p>
        <ul>
          <li>
            <strong>Stripe</strong> — processamento de pagamentos e assinaturas.
          </li>
          <li>
            <strong>Google</strong> — verificação de identidade quando você
            escolhe &quot;Continuar com Google&quot; (recebemos apenas a
            confirmação de identidade, nunca sua senha do Google).
          </li>
          <li>
            <strong>Provedor de e-mail transacional</strong> — envio de e-mails
            de ativação de conta e avisos de segurança.
          </li>
          <li>
            <strong>Provedor de hospedagem em nuvem</strong> — onde a aplicação
            e o banco de dados rodam.
          </li>
          <li>
            O educador físico ou nutricionista que você vincula à sua conta,
            apenas com os dados necessários ao acompanhamento.
          </li>
        </ul>
        <p>
          Podemos compartilhar dados com autoridades públicas quando exigido por
          lei, ordem judicial ou para proteger direitos, segurança ou
          propriedade da Vita Flow e de seus usuários.
        </p>
      </LegalSection>

      <LegalSection
        id="cookies"
        number="06"
        title="Cookies e tecnologias semelhantes"
      >
        <p>
          Usamos cookies estritamente necessários ao funcionamento do serviço:
          um cookie de sessão para manter você conectado, e um cookie técnico
          separado e protegido (<code>httpOnly</code>) que guarda o token de
          acesso usado para autenticar suas requisições ao nosso servidor — ele
          não pode ser lido por scripts no seu navegador. Atualmente não usamos
          cookies de rastreamento ou publicidade de terceiros. Se isso mudar,
          esta política será atualizada antes da mudança entrar em vigor.
        </p>
      </LegalSection>

      <LegalSection
        id="retencao"
        number="07"
        title="Por quanto tempo guardamos seus dados"
      >
        {/* TODO: confirmar com jurídico o prazo exato de retenção pós-exclusão
            e qualquer exceção fiscal/regulatória aplicável. */}
        <p>
          Guardamos seus dados enquanto sua conta estiver ativa e pelo tempo
          necessário para cumprir as finalidades desta política. Após a exclusão
          da conta, os dados são removidos ou anonimizados em até 30 dias,
          exceto quando a lei exigir retenção por mais tempo (por exemplo,
          registros fiscais de pagamento).
        </p>
      </LegalSection>

      <LegalSection
        id="seguranca"
        number="08"
        title="Como protegemos seus dados"
      >
        <p>
          Senhas são armazenadas com hash criptográfico (nunca em texto puro),
          toda comunicação entre seu navegador e nossos servidores é
          criptografada (HTTPS), e o acesso a dados de saúde é restrito a quem
          realmente precisa deles para prestar o serviço. Nenhum sistema é 100%
          imune a incidentes; caso ocorra um que afete seus dados, você e a
          Autoridade Nacional de Proteção de Dados (ANPD) serão notificados
          conforme exige a LGPD.
        </p>
      </LegalSection>

      <LegalSection
        id="direitos"
        number="09"
        title="Seus direitos como titular"
      >
        <p>
          Nos termos do art. 18 da LGPD, você pode a qualquer momento solicitar:
        </p>
        <ul>
          <li>Confirmação de que tratamos seus dados, e acesso a eles.</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados.</li>
          <li>
            Anonimização, bloqueio ou eliminação de dados desnecessários ou
            tratados em desconformidade com a lei.
          </li>
          <li>Portabilidade dos seus dados a outro fornecedor de serviço.</li>
          <li>Eliminação dos dados tratados com base no seu consentimento.</li>
          <li>Informação sobre com quem compartilhamos seus dados.</li>
          <li>Revogação do consentimento, a qualquer momento, sem custo.</li>
        </ul>
        {/* TODO: canal dedicado do encarregado de dados (DPO) — hoje aponta
            para o e-mail geral de contato; considerar um endereço próprio. */}
        <p>
          Para exercer qualquer um desses direitos, escreva para{' '}
          <a
            href="mailto:contato@vitaflow.app"
            className="text-primary underline underline-offset-2"
          >
            contato@vitaflow.app
          </a>
          . Respondemos em até 15 dias.
        </p>
      </LegalSection>

      <LegalSection id="menores" number="10" title="Menores de idade">
        <p>
          A Vita Flow não é direcionada a menores de 18 anos. Não coletamos
          intencionalmente dados de menores sem o consentimento específico e
          destacado de um dos pais ou responsável legal, conforme o art. 14 da
          LGPD.
        </p>
      </LegalSection>

      <LegalSection
        id="alteracoes"
        number="11"
        title="Alterações nesta política"
      >
        <p>
          Podemos atualizar esta política periodicamente. Mudanças relevantes
          serão comunicadas por e-mail ou por aviso destacado dentro da
          plataforma antes de entrarem em vigor.
        </p>
      </LegalSection>

      <LegalSection
        id="contato"
        number="12"
        title="Contato e encarregado de dados"
      >
        <p>
          Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem
          ser enviadas ao nosso Encarregado de Proteção de Dados (DPO) ou para{' '}
          <a
            href="mailto:contato@vitaflow.app"
            className="text-primary underline underline-offset-2"
          >
            contato@vitaflow.app
          </a>
          .
        </p>
      </LegalSection>

      <Card className="p-5 gap-2">
        <p className="text-sm">
          Veja também os{' '}
          <Link
            href="/terms"
            className="text-primary font-semibold underline underline-offset-2"
          >
            Termos de Uso
          </Link>{' '}
          da Vita Flow.
        </p>
      </Card>
    </LegalPageLayout>
  );
}
