const handleUpdate = (updatedDemoData: Partial<DemoSession>) => {
    const updatedSession = {
      ...demo,
      ...updatedDemoData,
      date: updatedDemoData.date ? updatedDemoData.date.toISOString() : demo.date,
      time: updatedDemoData.time || demo.startTime,
      status: updatedDemoData.status || demo.status,
      joinLink: updatedDemoData.joinLink || demo.joinLink,
    };
    onUpdateSession(demo.id, updatedSession); // Call the prop with id and updated data
    setCurrentStatus(updatedSession.status);
    setIsManageModalOpen(false);
  };