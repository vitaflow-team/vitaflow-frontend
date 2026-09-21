'use client';

import { useAlertHook } from '@/_hooks/alertHook';
import {
  ACCESS_NOTICE_PARAM,
  getAccessNotice,
  stripNoticeParam,
} from '@/_lib/accessNotice';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef } from 'react';

export function AccessNotice() {
  const searchParams = useSearchParams();
  const { openError } = useAlertHook();
  const handled = useRef(false);

  useEffect(() => {
    const code = searchParams.get(ACCESS_NOTICE_PARAM);
    if (code === null) {
      handled.current = false;
      return;
    }

    if (handled.current) {
      return;
    }

    handled.current = true;
    const notice = getAccessNotice(code);
    const search = stripNoticeParam(window.location.search);
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${search}${window.location.hash}`
    );

    if (notice) {
      openError(notice.message, notice.title, notice.type ?? 'info');
    }
  }, [openError, searchParams]);

  return null;
}
