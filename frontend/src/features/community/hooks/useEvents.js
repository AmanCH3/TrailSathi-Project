import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsService } from '../services/eventsService';
import { toast } from 'react-toastify';

export const useEvents = (groupId) => {
  return useQuery({
    queryKey: ['events', groupId],
    queryFn: () => eventsService.getEvents(groupId),
    enabled: !!groupId,
    staleTime: 60000,
  });
};

export const useEventDetail = (eventId) => {
  return useQuery({
    queryKey: ['event', eventId],
    queryFn: () => eventsService.getEventDetail(eventId),
    enabled: !!eventId,
    staleTime: 60000,
  });
};

export const useRSVPEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, hasRSVPd }) =>
      hasRSVPd ? eventsService.unrsvpEvent(eventId) : eventsService.rsvpEvent(eventId),
    onMutate: async ({ eventId, hasRSVPd, groupId }) => {
      await queryClient.cancelQueries({ queryKey: ['events', groupId] });
      await queryClient.cancelQueries({ queryKey: ['event', eventId] });

      const previousEvents = queryClient.getQueryData(['events', groupId]);
      const previousEvent = queryClient.getQueryData(['event', eventId]);

      // Update events list
      queryClient.setQueryData(['events', groupId], (old) => {
        if (!old?.events) return old;
        return {
          ...old,
          events: old.events.map((e) =>
            e.id === eventId || e._id === eventId
              ? {
                  ...e,
                  hasRSVPd: !hasRSVPd,
                  rsvpCount: hasRSVPd ? Math.max(0, (e.rsvpCount || 0) - 1) : (e.rsvpCount || 0) + 1,
                }
              : e
          ),
        };
      });

      // Update event detail
      queryClient.setQueryData(['event', eventId], (old) => {
        if (!old) return old;
        return {
          ...old,
          hasRSVPd: !hasRSVPd,
          rsvpCount: hasRSVPd ? Math.max(0, (old.rsvpCount || 0) - 1) : (old.rsvpCount || 0) + 1,
        };
      });

      return { previousEvents, previousEvent };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['events', variables.groupId], context.previousEvents);
      queryClient.setQueryData(['event', variables.eventId], context.previousEvent);
      toast.error('Failed to update RSVP.');
    },
    onSuccess: (data, variables) => {
      toast.success(variables.hasRSVPd ? 'RSVP removed' : 'RSVP confirmed!');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
  });
};

export const useConfirmAttendance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, isConfirmed }) =>
      isConfirmed ? eventsService.unconfirmAttendance(eventId) : eventsService.confirmAttendance(eventId),
    onMutate: async ({ eventId, isConfirmed }) => {
      await queryClient.cancelQueries({ queryKey: ['event', eventId] });
      const previousEvent = queryClient.getQueryData(['event', eventId]);

      queryClient.setQueryData(['event', eventId], (old) => {
        if (!old) return old;
        return {
          ...old,
          isConfirmed: !isConfirmed,
        };
      });

      return { previousEvent };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['event', variables.eventId], context.previousEvent);
      toast.error('Failed to update attendance.');
    },
    onSuccess: (data, variables) => {
      toast.success(variables.isConfirmed ? 'Attendance removed' : 'Attendance confirmed!');
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: ['event', variables.eventId] });
    },
  });
};

export const useCreateEvent = (groupId) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventData) => eventsService.createEvent(groupId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', groupId] });
      toast.success('Event created!');
    },
    onError: () => {
      toast.error('Failed to create event.');
    },
  });
};
