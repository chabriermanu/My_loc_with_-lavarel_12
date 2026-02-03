import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { Loan } from '@/types/model';
import { Link } from '@inertiajs/react';
import {
    AlertCircle,
    Ban,
    Calendar,
    CheckCircle,
    Clock,
    MessageCircle,
    Package,
    User,
    XCircle,
} from 'lucide-react';
import { Button } from '../ui/button';

interface LoanCardProps {
    loan: Loan;
    userRole: 'owner' | 'borrower';
    onApprove?: (loanId: number) => void;
    onReject?: (loanId: number) => void;
    onComplete?: (loanId: number) => void;
}

export function LoanCard({
    loan,
    userRole,
    onApprove,
    onReject,
    onComplete,
}: LoanCardProps) {
    const getStatusIcon = () => {
        switch (loan.status) {
            case 'pending':
                return <Clock className="h-5 w-5 text-yellow-500" />;
            case 'approved':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'in_progress':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'completed':
                return <CheckCircle className="h-5 w-5 text-blue-500" />;
            case 'cancelled':
                return <Ban className="h-5 w-5 text-gray-500" />;
            case 'overdue':
                return <AlertCircle className="h-5 w-5 text-red-600" />;
            default:
                return <AlertCircle className="h-5 w-5 text-gray-500" />;
        }
    };

    const getStatusText = () => {
        switch (loan.status) {
            case 'pending':
                return 'En attente';
            case 'approved':
                return 'Approuvé';
            case 'in_progress':
                return 'En cours';
            case 'completed':
                return 'Terminé';
            case 'cancelled':
                return 'Annulé';
            case 'overdue':
                return 'En retard';
            default:
                return loan.status;
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Card className="transition-shadow hover:shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-semibold">
                            {loan.item?.name ?? 'Article'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {getStatusIcon()}
                        <span className="text-sm font-medium">
                            {getStatusText()}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>
                        {userRole === 'owner'
                            ? `Emprunteur: ${loan.borrower?.name ?? 'Inconnu'}`
                            : `Propriétaire: ${loan.item?.owner?.name ?? 'Inconnu'}`}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                            Du {formatDate(loan.start_date)} au{' '}
                            {formatDate(loan.end_date)}
                        </span>
                    </div>
                </div>

                {loan.messages && loan.messages.length > 0 && (
                    <div className="flex items-start gap-2 rounded-md bg-muted p-3 text-sm">
                        <MessageCircle className="mt-0.5 h-4 w-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                            {loan.messages[loan.messages.length - 1].content}
                        </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex gap-2 pt-3">
                {userRole === 'owner' && loan.status === 'pending' && (
                    <>
                        <Button
                            onClick={() => onApprove?.(loan.id)}
                            variant="default"
                            size="sm"
                            className="flex-1"
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approuver
                        </Button>
                        <Button
                            onClick={() => onReject?.(loan.id)}
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                        >
                            <XCircle className="mr-2 h-4 w-4" />
                            Refuser
                        </Button>
                    </>
                )}

                {userRole === 'owner' && loan.status === 'in_progress' && (
                    <Button
                        onClick={() => onComplete?.(loan.id)}
                        variant="default"
                        size="sm"
                        className="flex-1"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Marquer comme restitué
                    </Button>
                )}

                <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/loans/${loan.id}`}>Voir détails</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
