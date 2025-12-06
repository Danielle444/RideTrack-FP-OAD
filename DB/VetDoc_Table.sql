USE [RideTrack-FP-OAD];
GO

ALTER TABLE Entries
ADD VeterinaryDocumentPath NVARCHAR(500) NULL;
GO

PRINT '✅ Column VeterinaryDocumentPath added successfully!';