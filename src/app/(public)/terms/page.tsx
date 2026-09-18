import {
  LegalPageLayout,
  LegalSection,
} from '@/_components/legal/legalPageLayout';
import { Card } from '@/_components/ui/card';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description:
    'As condições para criar uma conta e usar a plataforma Vita Flow — planos, pagamento, conduta esperada e limites de responsabilidade.',
};

const TOC = [
  { id: 'aceitacao', label: '1. Aceitação' },
  { id: 'quem-pode-usar', label: '2. Quem pode usar' },
  { id: 'o-servico', label: '3. O serviço' },
  { id: 'sua-conta', label: '4. Sua conta' },
  { id: 'planos-pagamento', label: '5. Planos e pagamento' },
  { id: 'aviso-saude', label: '6. Aviso sobre saúde' },
  { id: 'conduta', label: '7. Conduta do usuário' },
  { id: 'seu-conteudo', label: '8. Seu conteúdo' },
  { id: 'propriedade-intelectual', label: '9. Propriedade intelectual' },
  { id: 'limitacao', label: '10. Limitação de responsabilidade' },
  { id: 'rescisao', label: '11. Rescisão' },
  { id: 'alteracoes', label: '12. Alterações' },
  { id: 'lei-foro', label: '13. Lei e foro' },
  { id: 'contato', label: '14. Contato' },
];

export default function Terms() {
  return (
    <LegalPageLayout
      title="Termos de Uso"
      updatedAt="18 de setembro de 2026"
      toc={TOC}
    >
      <LegalSection id="aceitacao" number="01" title="Aceitação dos termos">
        <p>
          Ao criar uma conta ou usar a Vita Flow, você concorda com estes Termos
          de Uso e com a nossa{' '}
          <Link
            href="/privacy"
            className="text-primary underline underline-offset-2"
          >
            Política de Privacidade
          </Link>
          . Se você não concorda, não utilize o serviço.
        </p>
      </LegalSection>

      <LegalSection id="quem-pode-usar" number="02" title="Quem pode usar">
        <p>
          Você precisa ter pelo menos 18 anos para criar uma conta. Ao se
          cadastrar, você declara que as informações fornecidas são verdadeiras,
          completas e atualizadas, e que é responsável por mantê-las assim.
        </p>
      </LegalSection>

      <LegalSection id="o-servico" number="03" title="O que é a Vita Flow">
        <p>
          A Vita Flow é uma plataforma que conecta educadores físicos,
          nutricionistas e usuários para organizar treinos, planos alimentares e
          o acompanhamento da evolução de saúde. Educadores físicos e
          nutricionistas usam a plataforma para gerenciar alunos e pacientes;
          qualquer pessoa pode se cadastrar como usuária para acompanhar a
          própria evolução.
        </p>
      </LegalSection>

      <LegalSection id="sua-conta" number="04" title="Sua conta">
        <p>
          Você pode entrar por e-mail e senha, ou por &quot;Continuar com
          Google&quot;. Você é responsável por manter sua senha em sigilo e por
          toda atividade realizada na sua conta. Avise-nos imediatamente se
          suspeitar de uso não autorizado. Cada pessoa pode manter apenas uma
          conta.
        </p>
      </LegalSection>

      <LegalSection
        id="planos-pagamento"
        number="05"
        title="Planos e pagamento"
      >
        {/* TODO: linkar a política de reembolso quando ela existir como página
            própria; hoje o site não tem uma. */}
        <p>
          Alguns recursos exigem uma assinatura paga, cobrada de forma
          recorrente através do Stripe. Os preços vigentes são exibidos na
          página de planos antes da confirmação. Você pode cancelar sua
          assinatura a qualquer momento, sem multa e sem fidelidade; o
          cancelamento produz efeito ao final do período já pago.
        </p>
      </LegalSection>

      <LegalSection
        id="aviso-saude"
        number="06"
        title="Aviso importante sobre saúde"
      >
        <Card className="flex-row items-start gap-3 p-4 bg-secondary/30 border-primary/30">
          <AlertTriangle className="size-5 text-icon-accent shrink-0 mt-0.5" />
          <p className="text-sm">
            A Vita Flow é uma ferramenta de organização e acompanhamento —{' '}
            <strong>
              ela não substitui a avaliação, o diagnóstico ou a orientação de um
              profissional de saúde qualificado
            </strong>
            . Os treinos e planos alimentares disponibilizados são elaborados
            pelo educador físico ou nutricionista vinculado à sua conta; a Vita
            Flow não presta, por si, aconselhamento médico, nutricional ou de
            educação física. Em caso de dúvida sobre sua saúde, procure um
            profissional.
          </p>
        </Card>
      </LegalSection>

      <LegalSection id="conduta" number="07" title="Conduta do usuário">
        <p>Ao usar a Vita Flow, você concorda em não:</p>
        <ul>
          <li>
            Fornecer informações falsas de cadastro ou se passar por outra
            pessoa.
          </li>
          <li>
            Tentar acessar contas de outros usuários ou contornar mecanismos de
            autenticação e segurança.
          </li>
          <li>
            Usar a API ou credenciais internas da plataforma fora do uso
            pretendido pela aplicação oficial.
          </li>
          <li>
            Enviar conteúdo ilegal, ofensivo ou que viole direitos de terceiros.
          </li>
          <li>
            Fazer engenharia reversa, copiar ou revender o serviço sem
            autorização.
          </li>
        </ul>
      </LegalSection>

      <LegalSection id="seu-conteudo" number="08" title="Seu conteúdo">
        <p>
          Os dados que você registra (medidas, evolução, mensagens) continuam
          seus. Ao registrá-los, você nos concede uma licença limitada para
          armazenar, processar e exibir esse conteúdo unicamente para prestar o
          serviço a você e ao profissional vinculado à sua conta.
        </p>
      </LegalSection>

      <LegalSection
        id="propriedade-intelectual"
        number="09"
        title="Propriedade intelectual"
      >
        <p>
          A marca Vita Flow, o design da plataforma e o software que a operam
          são de propriedade da Vita Flow Tecnologia Ltda. e protegidos por lei.
          Nenhuma disposição destes termos transfere qualquer direito de
          propriedade intelectual a você, além do direito limitado de usar o
          serviço conforme aqui descrito.
        </p>
      </LegalSection>

      <LegalSection
        id="limitacao"
        number="10"
        title="Limitação de responsabilidade"
      >
        <p>
          A Vita Flow é fornecida &quot;como está&quot;. Na máxima extensão
          permitida em lei, não nos responsabilizamos por decisões de saúde
          tomadas com base no conteúdo da plataforma, nem por indisponibilidades
          temporárias do serviço. Nada nesta cláusula limita direitos que não
          possam ser limitados pela legislação brasileira de defesa do
          consumidor.
        </p>
      </LegalSection>

      <LegalSection id="rescisao" number="11" title="Rescisão">
        <p>
          Você pode encerrar sua conta a qualquer momento. Podemos suspender ou
          encerrar contas que violem estes termos, mediante aviso quando
          possível, exceto em casos de risco à segurança da plataforma ou de
          outros usuários.
        </p>
      </LegalSection>

      <LegalSection
        id="alteracoes"
        number="12"
        title="Alterações nestes termos"
      >
        <p>
          Podemos atualizar estes termos periodicamente. Mudanças relevantes
          serão comunicadas com antecedência razoável antes de entrarem em
          vigor.
        </p>
      </LegalSection>

      <LegalSection id="lei-foro" number="13" title="Lei aplicável e foro">
        {/* TODO: confirmar com jurídico se o foro eleito (sede da empresa)
            é o correto, com ressalva ao foro do consumidor. */}
        <p>
          Estes termos são regidos pelas leis da República Federativa do Brasil.
          Fica eleito o foro da comarca de São Miguel do Oeste - SC para dirimir
          quaisquer controvérsias, com renúncia a qualquer outro, por mais
          privilegiado que seja, ressalvado o foro do consumidor quando
          aplicável.
        </p>
      </LegalSection>

      <LegalSection id="contato" number="14" title="Contato">
        <p>
          Dúvidas sobre estes termos podem ser enviadas para{' '}
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
          Veja também a{' '}
          <Link
            href="/privacy"
            className="text-primary font-semibold underline underline-offset-2"
          >
            Política de Privacidade
          </Link>{' '}
          da Vita Flow.
        </p>
      </Card>
    </LegalPageLayout>
  );
}
