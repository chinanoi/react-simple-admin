import ApiException from './ApiException';
import messages from './exceptions.json';

export default function addGlobalApiExceptionListener(
    handleExceptionActionFn: (message: string) => void
) {
    const DEFAULT_EXCEPTION_MESSAGE = '系统繁忙，请稍后再试';

    // NOTE: 这个函数的名称不要改，请查看public/index.html
    function apiExceptionHandler(event: PromiseRejectionEvent): boolean {
        const exception = event.reason;
        if (exception instanceof ApiException) {
            const code = String(exception.code) as keyof typeof messages;
            const message = messages[code] || DEFAULT_EXCEPTION_MESSAGE;

            handleExceptionActionFn(message);

            event.preventDefault();
            return false;
        }
        return false;
    }

    window.addEventListener('unhandledrejection', apiExceptionHandler, false);
}
